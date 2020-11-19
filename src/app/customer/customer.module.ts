import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { InactiveVehiclesComponent } from './inactive-vehicles/inactive-vehicles.component';
import { InactiveVehicleDetailComponent } from './inactive-vehicles/inactive-vehicle-detail/inactive-vehicle-detail.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [InactiveVehiclesComponent, InactiveVehicleDetailComponent],
  imports: [CommonModule, CustomerRoutingModule, SharedModule]
})
export class CustomerModule {}
