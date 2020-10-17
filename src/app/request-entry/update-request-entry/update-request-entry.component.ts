import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
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
  vehicleCategories$: Observable<IVehicleCategory[]>;
  crudType: CrudType;
  CrudType = CrudType;
  Role = Role;
  id: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private timeService: TimeService,
    private requestEntryService: RequestEntryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private vehicleCategoryService: VehicleCategoryService
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
      IsVihicle: [true],
      StartTime: [''],
      EndTime: [''],
      TypeId: [null],
      TypePayment: [false],
      InputRealTime: [''],
      NoteDone: [''],
    });
  }

  getVehiclesCategories(parkingId: number): void {
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId);
  }

  getRequestEntryById(requestId: number): void {
    this.requestEntryService.getRequestEntryById(requestId).subscribe((requestEntry) => {
      this.requestEntryForm.patchValue({
        RequestDetailed: requestEntry.RequestDetailed,
        VisitorName: requestEntry.VisitorName,
        VisitorTel: requestEntry.VisitorTel,
        VisitorPassport: requestEntry.VisitorPassport,
        NumberVisitor: requestEntry.NumberVisitor,
        IsVihicle: this.crudType === CrudType.VIEW ? requestEntry.IsVihicle ? 'YES' : 'NO' : requestEntry.IsVihicle,
        StartTime: this.timeService.convertToDateTime(requestEntry.StartTime),
        EndTime: this.timeService.convertToDateTime(requestEntry.EndTime),
        TypeId: requestEntry.TypeId,
        TypePayment: this.crudType === CrudType.VIEW ? requestEntry.TypePayment ? 'YES' : 'NO' : requestEntry.TypePayment,
        InputRealTime: this.timeService.convertToDateTime(requestEntry.InputRealTime),
        NoteDone: requestEntry.NoteDone,
      });
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
      IsVihicle,
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
      IsVihicle,
      StartTime: this.timeService.toDateTimeString(StartTime),
      EndTime: this.timeService.toDateTimeString(EndTime),
      TypeId,
      TypePayment,
      UserInitial: this.authService.currentUserValue.Id,
      DateOfInitial: '',
      InputRealTime: this.timeService.toDateTimeString(InputRealTime),
      NoteDone,
    };

    this.requestEntryService.addRequestEntry(inputData).subscribe((res) => {
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
      IsVihicle,
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
      IsVihicle,
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
      case 'IsVihicle':
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
}
