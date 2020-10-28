import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ICustomer } from '@app/shared/interfaces/customer';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { CustomerService } from '@app/shared/services/customer.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CrudType } from '../../shared/enums/crud-type.enum';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: ICustomer[] = [];
  columns: ITableCol[] = [
    { key: 'CustomerId', display: 'ID' },
    { key: 'CustomerName', display: 'Customer Name' },
    { key: 'Address', display: 'Address' },
    { key: 'Disable', display: 'Disabled', type: 'boolean' }
  ];

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCustomerByParking(environment.parkingId);
  }

  getCustomerByParking(parkingId: number): void {
    this.customerService.getCustomerByParking(parkingId).subscribe(customers => {
      this.customers = customers;
    });
  }

  addNew(): void {
    this.router.navigate(['master-data/customers/detail', CrudType.CREATE]);
  }

  viewDetail(customer: ICustomer): void {
    this.router.navigate(['master-data/customers/detail', CrudType.VIEW, customer.CustomerId]);
  }

  editCustomer(customer: ICustomer): void {
    this.router.navigate(['master-data/customers/detail', CrudType.EDIT, customer.CustomerId]);
  }

  deleteCustomer(customer: ICustomer): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this vehicle?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.customerService.deleteCustomer(customer.CustomerId).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Vehicle');
            this.customers = this.customers.filter((value) => customer.CustomerId !== value.CustomerId);
          }
        });
      }
    });
  }
}
