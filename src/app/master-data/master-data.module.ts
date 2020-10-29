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
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { VehicleCategoriesComponent } from './vehicle-categories/vehicle-categories.component';
import { VehicleCategoryDetailComponent } from './vehicle-categories/vehicle-category-detail/vehicle-category-detail.component';
import { PricesComponent } from './prices/prices.component';
import { PriceDetailComponent } from './prices/price-detail/price-detail.component';
@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDetailComponent,
    VehiclesComponent,
    VehicleDetailComponent,
    EmployeesComponent,
    EmployeeDetailComponent,
    UsersComponent,
    UserDetailComponent,
    ChangePasswordComponent,
    VehicleCategoriesComponent,
    VehicleCategoryDetailComponent,
    PricesComponent,
    PriceDetailComponent],
  imports: [CommonModule, SharedModule, MasterDataRoutingModule],
})
export class MasterDataModule {}
