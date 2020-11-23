import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { IInactiveVehicleOffer } from '@app/shared/interfaces/inactive-vehicle-offer';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { InactiveVehicleOfferService } from '@app/shared/services/inactive-vehicle-offer.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-inactive-vehicles',
  templateUrl: './inactive-vehicles.component.html',
  styleUrls: ['./inactive-vehicles.component.scss']
})
export class InactiveVehiclesComponent implements OnInit, OnDestroy {
  offers: IInactiveVehicleOffer[] = [];
  columns: ITableCol[] = [
    { key: 'CustomerName', display: 'Customer_Name' },
    { key: 'ContentOffer', display: 'Offer_Content' },
    { key: 'Plate', display: 'Plate' },
    { key: 'DateOffer', display: 'Offer_Date', type: 'date' },
    { key: 'DateStartOffer', display: 'Start_Offer_Date', type: 'dateString' },
    { key: 'IsApproved', display: 'Is_Approved', type: 'boolean' },
    { key: 'DateApproved', display: 'Approval_Date', type: 'dateString' },
    { key: 'Notes', display: 'Notes' }
  ];

  subscription: Subscription;
  constructor(
    private router: Router,
    private inactiveVehicleOfferService: InactiveVehicleOfferService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private toastr: ToastrService
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
        this.offers = offers.map((offer) => {
          offer.canDelete = offer.IsApproved ? false : true;
          offer.canEdit = offer.IsApproved ? false : true;
          return offer;
        });
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

  deleteOffer(offer: IInactiveVehicleOffer): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this offer?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.inactiveVehicleOfferService.deleteOffer(offer.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Vehicle');
            this.offers = this.offers.filter((value) => value.Id !== offer.Id);
          }
        });
      }
    });
  }
}
