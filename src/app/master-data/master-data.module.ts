import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CustomersComponent } from './customers/customers.component';
import { MasterDataComponent } from './master-data.component';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleDetailComponent } from './vehicles/vehicle-detail/vehicle-detail.component';

@NgModule({
  declarations: [
    CustomersComponent,
    MasterDataComponent,
    CustomerDetailComponent,
    VehiclesComponent,
    VehicleDetailComponent,
  ],
  imports: [CommonModule, SharedModule, MasterDataRoutingModule],
})
export class MasterDataModule {}
