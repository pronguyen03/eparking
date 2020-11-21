import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { IInactiveVehicleOffer } from '@app/shared/interfaces/inactive-vehicle-offer';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { InactiveVehicleOfferService } from '@app/shared/services/inactive-vehicle-offer.service';
import { environment } from '@environments/environment';
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
    { key: 'IsApproved', display: 'Is Approved', type: 'boolean' },
    { key: 'DateApproved', display: 'Approval_Date' },
    { key: 'Notes', display: 'Notes' }
  ];
  subscription: Subscription;
  constructor(private router: Router, private inactiveVehicleOfferService: InactiveVehicleOfferService) {}

  ngOnInit(): void {
    this.getInactiveVehicleOffersByParking(environment.parkingId);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getInactiveVehicleOffersByParking(parkingId: number): void {
    this.subscription = timer(0, 30000)
      .pipe(switchMap(() => this.inactiveVehicleOfferService.getInactiveVehicleOffersByParking(parkingId)))
      .subscribe((offers) => {
        this.offers = offers.map((offer) => {
          offer.canDelete = false;
          offer.canEdit = false;
          return offer;
        });
      });
  }

  viewOffer(offer: IInactiveVehicleOffer): void {
    this.router.navigate(['manager/inactive-vehicles/detail', CrudType.VIEW, offer.Id]);
  }

  editOffer(offer: IInactiveVehicleOffer): void {
    this.router.navigate(['manager/inactive-vehicles/detail', CrudType.EDIT, offer.Id]);
  }

  addNew(): void {
    this.router.navigate(['manager/inactive-vehicles/detail', CrudType.CREATE]);
  }
}
