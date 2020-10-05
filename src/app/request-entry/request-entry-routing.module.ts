import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { RequestEntryComponent } from './request-entry.component';
import { UpdateRequestEntryComponent } from './update-request-entry/update-request-entry.component';

const routes: Routes = [
  { path: '', component: RequestEntryComponent, canActivate: [AuthGuard] },
  { path: 'detail/:crudType', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },
  { path: 'detail/:crudType/:id', component: UpdateRequestEntryComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestEntryRoutingModule {}
