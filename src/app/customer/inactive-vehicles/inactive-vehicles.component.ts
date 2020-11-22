import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { IInactiveVehicleOffer } from '@app/shared/interfaces/inactive-vehicle-offer';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { InactiveVehicleOfferService } from '@app/shared/services/inactive-vehicle-offer.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-inactive-vehicles',
  templateUrl: './inactive-vehicles.component.html',
  styleUrls: ['./inactive-vehicles.component.scss']
})
export class InactiveVehiclesComponent implements OnInit, OnDestroy {
  offers: IInactiveVehicleOffer[] = [];
  columns: ITableCol[] = [
    { key: 'ContentOffer', display: 'Offer_Content' },
    { key: 'DateOffer', display: 'Offer_Date', type: 'date' },
    { key: 'DateStartOffer', display: 'Start_Offer_Date', type: 'dateString' },
    { key: 'IsApproved', display: 'Is_Approved', type: 'boolean' },
    { key: 'DateApproved', display: 'Approval_Date' },
    { key: 'Notes', display: 'Notes' }
  ];

  subscription: Subscription;
  constructor(
    private router: Router,
    private inactiveVehicleOfferService: InactiveVehicleOfferService,
    private authService: AuthenticationService
  ) {}
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getInactiveVehicleOffersByCustomer(this.authService.currentUserValue.CustomerId);
  }

  getInactiveVehicleOffersByCustomer(customerId: number): void {
    this.subscription = this.inactiveVehicleOfferService
      .getInactiveVehicleOffersByCustomer(customerId)
      .subscribe((offers) => {
        this.offers = offers;
      });
  }

  viewOffer(offer: IInactiveVehicleOffer): void {
    this.router.navigate(['customer/inactive-vehicles/detail', CrudType.VIEW, offer.Id]);
  }

  editOffer(offer: IInactiveVehicleOffer): void {
    this.router.navigate(['customer/inactive-vehicles/detail', CrudType.EDIT, offer.Id]);
  }

  addNew(): void {
    this.router.navigate(['customer/inactive-vehicles/detail', CrudType.CREATE]);
  }
}
