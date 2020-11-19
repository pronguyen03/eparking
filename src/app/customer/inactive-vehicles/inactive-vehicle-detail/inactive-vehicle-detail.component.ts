import { Identifiers } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { ICustomer } from '@app/shared/interfaces/customer';
import { IVehicle } from '@app/shared/interfaces/vehicle';
import { CustomerService } from '@app/shared/services/customer.service';
import { InactiveVehicleOfferService } from '@app/shared/services/inactive-vehicle-offer.service';
import { TimeService } from '@app/shared/services/time.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-inactive-vehicle-detail',
  templateUrl: './inactive-vehicle-detail.component.html',
  styleUrls: ['./inactive-vehicle-detail.component.scss']
})
export class InactiveVehicleDetailComponent implements OnInit {
  crudType: CrudType;
  CrudType = CrudType;
  customers$: Observable<ICustomer[]>;
  vehicles$: Observable<IVehicle[]>;
  offerForm: FormGroup;
  id: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private inactiveVehicleOfferService: InactiveVehicleOfferService,
    private toastr: ToastrService,
    private timeService: TimeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.customers$ = this.customerService.getCustomerByParking(environment.parkingId);
    this.vehicles$ = this.offerForm.controls.CustomerId.valueChanges.pipe(
      switchMap((customerId) => this.getVehiclesByCustomer(customerId))
    );

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getOfferById(this.id);
      }
    });
  }

  initForm(): void {
    this.offerForm = this.fb.group({
      Id: [0],
      eParkingId: [environment.parkingId],
      CustomerId: [null, Validators.required],
      VehicleId: [null, Validators.required],
      StartOfferDate: [null, Validators.required],
      OfferContent: [null, Validators.required]
    });
  }

  getVehiclesByCustomer(customerId: number): Observable<IVehicle[]> {
    return this.vehicleService.getVehiclesByCustomer(customerId).pipe(
      map((vehicles) => {
        return vehicles.filter((vehicle) => vehicle.Status === VehicleStatus.APPROVED);
      })
    );
  }

  getOfferById(offerId: number): void {
    this.inactiveVehicleOfferService.getOfferById(offerId).subscribe((offer) => {
      this.offerForm.patchValue({
        CustomerId: offer.CustomerId,
        VehicleId: offer.VihicleId,
        StartOfferDate: this.timeService.convertToDateTime(offer.DateStartOffer),
        OfferContent: offer.ContentOffer
      });
    });
  }

  back(): void {
    this.router.navigateByUrl('customer/inactive-vehicles');
  }

  save(): void {
    if (this.offerForm.valid) {
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
    } else {
      this.offerForm.markAllAsTouched();
    }
  }

  create(): void {
    const { CustomerId, VehicleId, StartOfferDate, OfferContent } = this.offerForm.value;
    const inputData = {
      EparkingId: environment.parkingId,
      CustomerId,
      VihicleId: VehicleId,
      ContentOffer: OfferContent,
      DateStartOffer: this.timeService.toDateTimeString(StartOfferDate)
    };
    this.inactiveVehicleOfferService.addOffer(inputData).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Created successfully.', 'Inactive Vehicle Offer');
        this.refresh(res.Data.Id);
      }
    });
  }

  update(): void {
    const { VehicleId, StartOfferDate, OfferContent } = this.offerForm.value;
    const inputData = {
      Id: this.id,
      VihicleId: VehicleId,
      ContentOffer: OfferContent,
      DateStartOffer: this.timeService.toDateTimeString(StartOfferDate)
    };
    this.inactiveVehicleOfferService.updateOffer(inputData).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Updated successfully.', 'Inactive Vehicle Offer');
        this.refresh(res.Data.Id);
      }
    });
  }

  confirmDialog(functionName: string, title: string, message: string): void {
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        switch (functionName) {
          case 'handover':
            this.handover();
            break;
          default:
            break;
        }
      }
    });
  }

  handover(): void {
    this.inactiveVehicleOfferService.setApproving(this.id).subscribe((res) => {
      if (res.Code === '100') {
        this.toastr.success('Handovered successfully.', 'Inactive Vehicle Offer');
        this.back();
      }
    });
  }

  refresh(id: string): void {
    this.router.navigate(['customer/inactive-vehicles/detail', CrudType.EDIT, id]);
  }
}
