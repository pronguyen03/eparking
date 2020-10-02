import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CustomersComponent } from './customers/customers.component';
import { MasterDataComponent } from './master-data.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';


@NgModule({
  declarations: [CustomersComponent, MasterDataComponent, CustomerDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    MasterDataRoutingModule
  ]
})
export class MasterDataModule { }
