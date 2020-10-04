import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleDetailComponent } from './vehicles/vehicle-detail/vehicle-detail.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';

@NgModule({
  declarations: [CustomersComponent, CustomerDetailComponent, VehiclesComponent, VehicleDetailComponent, EmployeesComponent, EmployeeDetailComponent],
  imports: [CommonModule, SharedModule, MasterDataRoutingModule],
})
export class MasterDataModule {}
