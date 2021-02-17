import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { CustomerComponent } from './customer/customer.component';
import { InactiveVehicleDetailComponent } from './inactive-vehicles/inactive-vehicle-detail/inactive-vehicle-detail.component';
import { InactiveVehiclesComponent } from './inactive-vehicles/inactive-vehicles.component';
import { PendingApprovalVehicleDetailComponent } from './pending-approval-vehicles/pending-approval-vehicle-detail/pending-approval-vehicle-detail.component';
import { PendingApprovalVehiclesComponent } from './pending-approval-vehicles/pending-approval-vehicles.component';
import { RequestEntryComponent } from './request-entry/request-entry.component';
import { UpdateRequestEntryComponent } from './request-entry/update-request-entry/update-request-entry.component';
import { VehicleDetailComponent } from './vehicles/vehicle-detail/vehicle-detail.component';
import { VehiclesComponent } from './vehicles/vehicles.component';

const routes: Routes = [
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
    component: InactiveVehicleDetailComponent,
    canActivate: [AuthGuard]
  },

  { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuard] },
  { path: 'vehicles/detail/:crudType', component: VehicleDetailComponent, canActivate: [AuthGuard] },
  { path: 'vehicles/detail/:crudType/:id', component: VehicleDetailComponent, canActivate: [AuthGuard] },

  { path: 'request-entry', component: RequestEntryComponent, canActivate: [AuthGuard] },
  { path: 'request-entry/detail/:crudType', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },
  { path: 'request-entry/detail/:crudType/:id', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },

  { path: 'customers', component: CustomerComponent, canActivate: [AuthGuard] }
  // { path: 'customer/detail/:crudType', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },
  // { path: 'customer/detail/:crudType/:id', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {}
