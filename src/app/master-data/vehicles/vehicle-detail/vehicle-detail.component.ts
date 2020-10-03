import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategory } from '@app/shared/classes/vehicle-category';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
})
export class VehicleDetailComponent implements OnInit {
  VehicleStatus = VehicleStatus;
  CrudType = CrudType;
  vehicleForm: FormGroup;
  vehicleCategories$: Observable<VehicleCategory[]>;
  crudType: CrudType;
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private vehicleCategoryService: VehicleCategoryService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesCategories(environment.parkingId);

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getVehicleById(this.id);
      }
    });
  }

  initForm(): void {
    this.vehicleForm = this.fb.group({
      CustomerId: [''],
      CustomerName: [''],
      TypeId: [''],
      Plate: [''],
      DateOfPayment: [''],
      CurrentStatus: [''],
      Status: [VehicleStatus.NEW],
      IsApproved: [false],
      WhoApproved: [''],
      Notes: [''],
      ImagePath: [''],
    });
  }

  back(): void {
    this.router.navigateByUrl('master-data/vehicles');
  }

  getVehiclesCategories(parkingId: number): void {
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId);
  }

  getVehicleById(vehicleId: number): void {
    this.vehicleService.getVehicleById(vehicleId).subscribe((vehicle) => {
      this.vehicleForm.patchValue({
        CustomerId: vehicle.CustomerId,
        CustomerName: vehicle.CustomerName,
        TypeId: vehicle.TypeId,
        Plate: vehicle.Plate,
        DateOfPayment: new Date(vehicle.DateOfPayment),
        Status: vehicle.Status,
        IsApproved: vehicle.IsApproved,
        WhoApproved: vehicle.WhoApproved,
        Notes: vehicle.Notes,
      });
    });
  }

  save(): void {
    switch (this.crudType) {
      case CrudType.CREATE:
        this.create();
        break;
      case CrudType.EDIT:
        this.update();
        break;
      default:
        break;
    }
  }

  create(): void {
    const { Plate, TypeId, CurrentStatus, DateOfPayment, Notes } = this.vehicleForm.value;
    const inputData = {
      EParkingId: environment.parkingId,
      CustomerId: this.authService.currentUserValue.CustomerId,
      Plate,
      TypeId,
      CurrentStatus,
      DateOfPayment,
      ImagePath: '',
      Notes,
    };

    this.vehicleService.addVehicle(inputData).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Created successfully.', 'Vehicle');
        this.back();
      }
    });
  }

  update(): void {
    const { Plate, TypeId, CurrentStatus, DateOfPayment, Notes } = this.vehicleForm.value;
    const inputData = {
      Id: this.id,
      Plate,
      TypeId,
      CurrentStatus,
      DateOfPayment,
      ImagePath: '',
      Notes,
    };

    this.vehicleService.updateVehicle(inputData).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Updated successfully.', 'Vehicle');
        this.back();
      }
    });
  }

  handover(): void {
    this.vehicleService.setApproving(this.id).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Handovered successfully.', 'Vehicle');
        this.back();
      }
    });
  }

  approve(): void {
    this.vehicleService.setApproved(this.id).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Approved the vehicle.', 'Vehicle');
        this.back();
      }
    });
  }

  cancel(): void {
    this.vehicleService.cancelApprove(this.id).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Canceled successfully.', 'Vehicle');
        this.back();
      }
    });
  }

  confirmDialog(functionName: string, title: string, message: string): void {
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        switch (functionName) {
          case 'handover':
            this.handover();
            break;
          case 'approve':
            this.approve();
            break;
          case 'approve':
            this.cancel();
            break;
          default:
            break;
        }
      }
    });
  }
}
