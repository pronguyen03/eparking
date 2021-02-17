import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICustomer } from '@app/shared/interfaces/customer';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { CustomerService } from '@app/shared/services/customer.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customers: ICustomer[] = [];
  columns: ITableCol[] = [
    { key: 'CustomerId', display: 'ID' },
    { key: 'CustomerName', display: 'Customer_Name' },
    { key: 'Address', display: 'Address' },
    { key: 'Disable', display: 'Disabled', type: 'boolean' }
  ];

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCustomerByParking(environment.parkingId);
  }

  getCustomerByParking(parkingId: number): void {
    this.customerService.getCustomerByParking(parkingId).subscribe((customers) => {
      this.customers = customers;
    });
  }
}
