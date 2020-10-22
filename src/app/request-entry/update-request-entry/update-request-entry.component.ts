import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { IAccessVehicle } from '@app/shared/interfaces/access-vehicle';
import { IVehicle } from '@app/shared/interfaces/vehicle';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { RequestEntryService } from '@app/shared/services/request-entry.service';
import { TimeService } from '@app/shared/services/time.service';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-request-entry',
  templateUrl: './update-request-entry.component.html',
  styleUrls: ['./update-request-entry.component.scss'],
})
export class UpdateRequestEntryComponent implements OnInit {
  requestEntryForm: FormGroup;
  accessVehicleForm: FormGroup;
  vehicleCategories$: Observable<IVehicleCategory[]>;
  crudType: CrudType;
  CrudType = CrudType;
  Role = Role;
  id: number;

  listAccessVehicles: IAccessVehicle[] = [];
  listSelectedVehicles: IAccessVehicle[] = [];
  columns = [
    { key: 'colNo', display: 'No.' },
    { key: 'Plate', display: 'Plate' },
    { key: 'TypeName', display: 'Type' },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private timeService: TimeService,
    private requestEntryService: RequestEntryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private vehicleCategoryService: VehicleCategoryService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesCategories(environment.parkingId);

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = params.id;
      if (this.id) {
        this.getRequestEntryById(this.id);
      }
      if (this.crudType === CrudType.VIEW) {
        // this.requestEntryForm.disable();
      }
    });
  }

  initForm(): void {
    this.requestEntryForm = this.fb.group({
      RequestDetailed: ['', Validators.required],
      VisitorName: ['', Validators.required],
      VisitorTel: [''],
      VisitorPassport: [''],
      NumberVisitor: [1, Validators.required],
      IsVehicle: [true],
      StartTime: [''],
      EndTime: [''],
      TypeId: [0],
      TypePayment: [false],
      InputRealTime: [''],
      NoteDone: [''],
    });

    this.accessVehicleForm = this.fb.group({
      Plate: ['', Validators.required],
      Type: [0, Validators.required]
    });
  }

  getVehiclesCategories(parkingId: number): void {
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId);
  }

  getRequestEntryById(requestId: number): void {
    this.requestEntryService.getRequestEntryById(requestId).subscribe((res) => {
      const requestEntry = res.Item;
      const requestEntryDetails = res.ItemDetaileds;
      this.requestEntryForm.patchValue({
        RequestDetailed: requestEntry.RequestDetailed,
        VisitorName: requestEntry.VisitorName,
        VisitorTel: requestEntry.VisitorTel,
        VisitorPassport: requestEntry.VisitorPassport,
        NumberVisitor: requestEntry.NumberVisitor,
        IsVehicle: this.crudType === CrudType.VIEW ? requestEntry.IsVihicle ? 'YES' : 'NO' : requestEntry.IsVihicle,
        StartTime: this.timeService.convertToDateTime(requestEntry.StartTime),
        EndTime: this.timeService.convertToDateTime(requestEntry.EndTime),
        TypeId: requestEntry.TypeId,
        TypePayment: this.crudType === CrudType.VIEW ? requestEntry.TypePayment ? 'YES' : 'NO' : requestEntry.TypePayment,
        InputRealTime: this.timeService.convertToDateTime(requestEntry.InputRealTime),
        NoteDone: requestEntry.NoteDone,
      });
      this.listAccessVehicles = requestEntryDetails;
    });
  }

  back(): void {
    this.router.navigateByUrl('request-entry');
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
    const {
      RequestDetailed,
      VisitorName,
      VisitorTel,
      VisitorPassport,
      NumberVisitor,
      IsVehicle,
      StartTime,
      EndTime,
      TypeId,
      TypePayment,
      InputRealTime,
      NoteDone,

    } = this.requestEntryForm.value;
    const inputData = {
      EParkingId: environment.parkingId,
      CustomerId: this.authService.currentUserValue.CustomerId,
      RequestDetailed,
      VisitorName,
      VisitorTel,
      VisitorPassport,
      NumberVisitor,
      IsVihicle: IsVehicle,
      StartTime: this.timeService.toDateTimeString(StartTime),
      EndTime: this.timeService.toDateTimeString(EndTime),
      TypeId,
      TypePayment,
      UserInitial: this.authService.currentUserValue.Id,
      DateOfInitial: '',
      InputRealTime: this.timeService.toDateTimeString(InputRealTime),
      NoteDone,
    };

    const ItemDetaileds = this.listAccessVehicles;
    this.requestEntryService.addRequestEntry(inputData, ItemDetaileds).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Created successfully.', 'Vehicle');
        this.back();
      }
    });
  }

  update(): void {
    const {
      RequestDetailed,
      VisitorName,
      VisitorTel,
      VisitorPassport,
      NumberVisitor,
      IsVehicle,
      StartTime,
      EndTime,
      TypeId,
      TypePayment,
    } = this.requestEntryForm.value;
    const inputData = {
      Id: this.id,
      RequestDetailed,
      VisitorName,
      VisitorTel,
      VisitorPassport,
      NumberVisitor,
      IsVihicle: IsVehicle,
      StartTime: this.timeService.toDateTimeString(StartTime),
      EndTime: this.timeService.toDateTimeString(EndTime),
      TypeId,
      TypePayment,
      UserUpdate: this.authService.currentUserValue.Id,
    };

    this.requestEntryService.updateRequestEntry(inputData).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Updated successfully.', 'Vehicle');
        this.back();
      }
    });
  }

  onRadioChange(formName: string, value: boolean): void {
    switch (formName) {
      case 'IsVehicle':
        if (value) {
          this.requestEntryForm.controls.TypeId.enable();
        } else {
          this.requestEntryForm.controls.TypeId.disable();
        }
        break;
      default:
        break;
    }
  }

  addAccessVehicle(): void {
    if (this.accessVehicleForm.valid) {
      const {
        Plate,
        Type
      }: { Plate: string, Type: IVehicleCategory} = this.accessVehicleForm.value;
      this.listAccessVehicles.push({
        Plate,
        TypeId: Type.Id,
        TypeName: Type.Name
      } as IAccessVehicle);

      this.listAccessVehicles = [...this.listAccessVehicles];
    }
  }

  deleteAccessVehicle(): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete these vehicles?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.listSelectedVehicles.forEach(valueSelect => {
          this.listAccessVehicles = this.listAccessVehicles.filter((value) => {
            return value !== valueSelect;
          });
        });
        this.listAccessVehicles = [...this.listAccessVehicles];
        this.listSelectedVehicles = [];
      }
    });
  }
}
