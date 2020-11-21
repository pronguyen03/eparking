import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { IPrice } from '@app/shared/interfaces/price';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { PriceService } from '@app/shared/services/price.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {
  prices: IPrice[] = [];
  columns: ITableCol[] = [
    { key: 'CustomerName', display: 'Customer_Name' },
    { key: 'ContractsNumber', display: 'Contract_No' },
    { key: 'IsActived', display: 'Active', type: 'boolean' },
    { key: 'ValidFromDate', display: 'From_Date', type: 'dateString' },
    { key: 'ValidToDate', display: 'To_Date', type: 'dateString' }
  ];

  constructor(
    private priceService: PriceService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPricesByParking(environment.parkingId);
  }

  getPricesByParking(parkingId: number): void {
    this.priceService.getPricesByParking(parkingId).subscribe((prices) => {
      this.prices = prices;
    });
  }

  addNew(): void {
    this.router.navigate(['master-data/prices/detail', CrudType.CREATE]);
  }

  viewDetail(price: IPrice): void {
    this.router.navigate(['master-data/prices/detail', CrudType.VIEW, price.Id]);
  }

  editPrice(price: IPrice): void {
    this.router.navigate(['master-data/prices/detail', CrudType.EDIT, price.Id]);
  }

  deletePrice(price: IPrice): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this prices?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.priceService.deletePrice(price.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Price');
            this.prices = this.prices.filter((value) => value.Id !== price.Id);
          }
        });
      }
    });
  }
}
