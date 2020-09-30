import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { CustomersComponent } from './customers/customers.component';

const routes: Routes = [
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'customers/detail/:crudType', component: CustomerDetailComponent, canActivate: [AuthGuard] },
  { path: 'customers/detail/:crudType/:id', component: CustomerDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
