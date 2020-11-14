import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { CustomersComponent } from './customers/customers.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';
import { EmployeesComponent } from './employees/employees.component';
import { InactiveVehicleDetailComponent } from './inactive-vehicles/inactive-vehicle-detail/inactive-vehicle-detail.component';
import { InactiveVehiclesComponent } from './inactive-vehicles/inactive-vehicles.component';
import { PendingApprovalVehicleDetailComponent } from './pending-approval-vehicles/pending-approval-vehicle-detail/pending-approval-vehicle-detail.component';
import { PendingApprovalVehiclesComponent } from './pending-approval-vehicles/pending-approval-vehicles.component';
import { PriceDetailComponent } from './prices/price-detail/price-detail.component';
import { PricesComponent } from './prices/prices.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';
import { VehicleCategoriesComponent } from './vehicle-categories/vehicle-categories.component';
import { VehicleCategoryDetailComponent } from './vehicle-categories/vehicle-category-detail/vehicle-category-detail.component';
import { VehicleDetailComponent } from './vehicles/vehicle-detail/vehicle-detail.component';
import { VehiclesComponent } from './vehicles/vehicles.component';

const routes: Routes = [
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'customers/detail/:crudType', component: CustomerDetailComponent, canActivate: [AuthGuard] },
  { path: 'customers/detail/:crudType/:id', component: CustomerDetailComponent, canActivate: [AuthGuard] },

  { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuard] },
  { path: 'vehicles/detail/:crudType', component: VehicleDetailComponent, canActivate: [AuthGuard] },
  { path: 'vehicles/detail/:crudType/:id', component: VehicleDetailComponent, canActivate: [AuthGuard] },

  { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] },
  { path: 'employees/detail/:crudType', component: EmployeeDetailComponent, canActivate: [AuthGuard] },
  { path: 'employees/detail/:crudType/:id', component: EmployeeDetailComponent, canActivate: [AuthGuard] },

  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/detail/:crudType', component: UserDetailComponent, canActivate: [AuthGuard] },
  { path: 'users/detail/:crudType/:id', component: UserDetailComponent, canActivate: [AuthGuard] },

  { path: 'vehicle-categories', component: VehicleCategoriesComponent, canActivate: [AuthGuard] },
  { path: 'vehicle-categories/detail/:crudType', component: VehicleCategoryDetailComponent, canActivate: [AuthGuard] },
  {
    path: 'vehicle-categories/detail/:crudType/:id',
    component: VehicleCategoryDetailComponent,
    canActivate: [AuthGuard]
  },

  { path: 'prices', component: PricesComponent, canActivate: [AuthGuard] },
  { path: 'prices/detail/:crudType', component: PriceDetailComponent, canActivate: [AuthGuard] },
  { path: 'prices/detail/:crudType/:id', component: PriceDetailComponent, canActivate: [AuthGuard] },

  { path: 'pending-approval-vehicles', component: PendingApprovalVehiclesComponent, canActivate: [AuthGuard] },
  {
    path: 'pending-approval-vehicles/detail/:crudType',
    component: PendingApprovalVehicleDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pending-approval-vehicles/detail/:crudType/:id',
    component: PendingApprovalVehicleDetailComponent,
    canActivate: [AuthGuard]
  },

  { path: 'inactive-vehicles', component: InactiveVehiclesComponent, canActivate: [AuthGuard] },
  { path: 'inactive-vehicles/detail/:crudType', component: InactiveVehicleDetailComponent, canActivate: [AuthGuard] },
  {
    path: 'inactive-vehicles/detail/:crudType/:id',
    component: PendingApprovalVehicleDetailComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule {}
