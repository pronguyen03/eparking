import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { ApiResponse } from '@app/shared/interfaces/api-response';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pending-approval-vehicle-detail',
  templateUrl: './pending-approval-vehicle-detail.component.html',
  styleUrls: ['./pending-approval-vehicle-detail.component.scss']
})
export class PendingApprovalVehicleDetailComponent implements OnInit {
  Role = Role;
  VehicleStatus = VehicleStatus;
  CrudType = CrudType;
  vehicleForm: FormGroup;
  vehicleCategories$: Observable<IVehicleCategory[]>;
  crudType: CrudType;
  id: number;
  imageURLResource = environment.host + '/Resources/VihicleImages/';

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  files: { data: any, inProgress: boolean, progress: number }[]  = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private vehicleCategoryService: VehicleCategoryService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) { }

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
      Plate: ['', [Validators.maxLength(9), Validators.pattern('^[a-zA-Z0-9]*$')]],
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
    this.router.navigateByUrl('master-data/pending-approval-vehicles');
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
        ImagePath: vehicle.ImagePath
      });
    });
  }

  omitSpecialChar(event): boolean {
    const k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
  }

  callUploadService(file): void {
    const formData = new FormData();
    formData.append('files', file.data);
    file.inProgress = true;
    this.vehicleService.uploadImage(formData).pipe(
      map((res: any) => {
        switch (res.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(res.loaded * 100 / res.total);
            break;
          case HttpEventType.Response:
            return res;
        }
      })).subscribe((res: HttpResponse<ApiResponse>) => {
          if (typeof (res) === 'object') {
            const body = res.body;
            if (body.Code === '100') {
              this.toastr.success('Uploaded Image successfully.', 'Vehicle');
              this.vehicleForm.patchValue({
                ImagePath: body.Data
            });
          }
        }
      });
  }

  private upload(): void {
    this.fileInput.nativeElement.value = '';
    this.files.forEach(file => {
      this.callUploadService(file);
    });
  }

  onClick(): void {
    const fileInput = this.fileInput.nativeElement;
    fileInput.onchange = () => {
      this.files = [];
      for (const file of fileInput.files) {
        this.files.push({ data: file, inProgress: false, progress: 0});
      }
      this.upload();
    };
    fileInput.click();
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
    if (this.vehicleForm.valid) {
      const { Plate, TypeId, CurrentStatus, DateOfPayment, Notes, ImagePath } = this.vehicleForm.value;
      const inputData = {
        EParkingId: environment.parkingId,
        CustomerId: this.authService.currentUserValue.CustomerId,
        Plate,
        TypeId,
        CurrentStatus,
        DateOfPayment,
        ImagePath,
        Notes,
      };

      this.vehicleService.addVehicle(inputData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Created successfully.', 'Vehicle');
          this.back();
        }
      });
    } else {
      this.toastr.error('Input Data is invalid. Please check again', 'Error');
    }
  }

  update(): void {
    const { Plate, TypeId, CurrentStatus, DateOfPayment, Notes, ImagePath } = this.vehicleForm.value;
    const inputData = {
      Id: this.id,
      Plate,
      TypeId,
      CurrentStatus,
      DateOfPayment,
      ImagePath,
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
          case 'cancel':
            this.cancel();
            break;
          default:
            break;
        }
      }
    });
  }
}
