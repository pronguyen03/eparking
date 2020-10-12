import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { AccessVehicleDetailComponent } from './access-vehicles/access-vehicle-detail/access-vehicle-detail.component';
import { AccessVehiclesComponent } from './access-vehicles/access-vehicles.component';
import { RequestEntryComponent } from './request-entry.component';
import { UpdateRequestEntryComponent } from './update-request-entry/update-request-entry.component';

const routes: Routes = [
  { path: '', component: RequestEntryComponent, canActivate: [AuthGuard] },
  { path: 'detail/:crudType', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },
  { path: 'detail/:crudType/:id', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },

  { path: 'access-vehicles', component: AccessVehiclesComponent, canActivate: [AuthGuard] },
  { path: 'access-vehicles/detail/:crudType', component: AccessVehicleDetailComponent, canActivate: [AuthGuard] },
  // { path: 'access-vehicles/detail/:crudType/:id', component: AccessVehicleDetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestEntryRoutingModule {}
