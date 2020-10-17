import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { CustomersComponent } from './customers/customers.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';
import { EmployeesComponent } from './employees/employees.component';
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


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDataRoutingModule {}
