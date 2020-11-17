import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { IInactiveVehicleOffer } from '@app/shared/interfaces/inactive-vehicle-offer';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { InactiveVehicleOfferService } from '@app/shared/services/inactive-vehicle-offer.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-inactive-vehicles',
  templateUrl: './inactive-vehicles.component.html',
  styleUrls: ['./inactive-vehicles.component.scss']
})
export class InactiveVehiclesComponent implements OnInit {
  offers: IInactiveVehicleOffer[] = [];
  columns: ITableCol[] = [
    { key: 'ContentOffer', display: 'Content Offer' },
    { key: 'DateOffer', display: 'Date Offer', type: 'date' },
    { key: 'DateStartOffer', display: 'Date Start Offer', type: 'dateString' },
    { key: 'IsApproved', display: 'Is Approved', type: 'boolean' },
    { key: 'DateApproved', display: 'Date Approved' },
    { key: 'Notes', display: 'Notes' }
  ];
  constructor(private router: Router, private inactiveVehicleOfferService: InactiveVehicleOfferService) {}

  ngOnInit(): void {
    this.getInactiveVehicleOffersByParking(environment.parkingId);
  }

  getInactiveVehicleOffersByParking(parkingId: number): void {
    this.inactiveVehicleOfferService.getInactiveVehicleOffersByParking(parkingId).subscribe((offers) => {
      this.offers = offers;
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
