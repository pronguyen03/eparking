import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { InactiveVehicleDetailComponent } from './inactive-vehicles/inactive-vehicle-detail/inactive-vehicle-detail.component';
import { InactiveVehiclesComponent } from './inactive-vehicles/inactive-vehicles.component';
import { PendingApprovalVehicleDetailComponent } from './pending-approval-vehicles/pending-approval-vehicle-detail/pending-approval-vehicle-detail.component';
import { PendingApprovalVehiclesComponent } from './pending-approval-vehicles/pending-approval-vehicles.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {}
