import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { IAccessVehicle } from '@app/shared/interfaces/access-vehicle';
import { IRequestEntry } from '@app/shared/interfaces/request-entry';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { AccessVehicleService } from '@app/shared/services/access-vehicle.service';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { RequestEntryService } from '@app/shared/services/request-entry.service';
import { TimeService } from '@app/shared/services/time.service';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { environment } from '@environments/environment';
import { endOfDay, startOfYear } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-access-vehicle-detail',
  templateUrl: './access-vehicle-detail.component.html',
  styleUrls: ['./access-vehicle-detail.component.scss']
})
export class AccessVehicleDetailComponent implements OnInit {
  accessVehicleForm: FormGroup;
  requestEntries$: Observable<IRequestEntry[]>;
  vehicleCategories$: Observable<IVehicleCategory[]>;
  crudType: CrudType;
  CrudType = CrudType;
  id: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private requestEntryService: RequestEntryService,
    private vehicleCategoryService: VehicleCategoryService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private accessVehicleService: AccessVehicleService,
    private toastr: ToastrService,
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(environment.parkingId);

    this.requestEntries$ = this.requestEntryService.getRequestsByCustomer(
      this.authService.currentUserValue.CustomerId,
      this.timeService.toDateTimeString(startOfYear(new Date())),
      this.timeService.toDateTimeString(endOfDay(new Date())));

    combineLatest([
      this.route.params,
      this.route.queryParams
    ]).subscribe(
      data => {
        const params = data[0];
        const queryParams = data[1];
        this.crudType = params.crudType;
        if (this.crudType !== CrudType.CREATE) {
          const {
            Id,
            RepuestEntryId,
            Plate,
            TypeId
          } = queryParams;
          this.accessVehicleForm.patchValue({
            Id: +Id,
            RepuestEntryId: +RepuestEntryId,
            Plate,
            TypeId: +TypeId
          });
        }
      }
    );
  }

  initForm(): void {
    this.accessVehicleForm = this.fb.group({
      Id: [null],
      RepuestEntryId: [null, Validators.required],
      Plate: ['', [Validators.required, Validators.maxLength(9), Validators.pattern('^[a-zA-Z0-9-]*$')]],
      TypeId: [null]
    });
  }

  back(): void {
    this.router.navigateByUrl('request-entry/access-vehicles');
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
      RepuestEntryId,
      Plate,
      TypeId
    } = this.accessVehicleForm.value;
    const inputData = {
      RepuestEntryId,
      Plate,
      TypeId
    };

    this.accessVehicleService.addAccessVehicle(inputData).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Created successfully.', 'Vehicle');
        this.back();
      }
    });
  }

  update(): void {
    const {
      Id,
      Plate,
      TypeId
    } = this.accessVehicleForm.value;
    const inputData = {
      Id,
      Plate,
      TypeId
    };

    this.accessVehicleService.updateAccessVehicle(inputData).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Updated successfully.', 'Vehicle');
        this.back();
      }
    });
  }

}
