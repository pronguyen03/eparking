import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestEntryComponent } from '@app/security-staff/request-entry/request-entry.component';
import { UpdateRequestEntryComponent } from '@app/security-staff/request-entry/update-request-entry/update-request-entry.component';
import { AuthGuard } from '@app/shared/guards/auth.guard';
const routes: Routes = [
  {
    path: 'request-entry',
    component: RequestEntryComponent,
    canActivate: [AuthGuard]
  },
  { path: 'request-entry/detail/:crudType', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },
  { path: 'request-entry/detail/:crudType/:id', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityStaffRoutingModule {}
