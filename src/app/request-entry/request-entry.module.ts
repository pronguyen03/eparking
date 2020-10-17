import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestEntryRoutingModule } from './request-entry-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { AccessVehiclesComponent } from './access-vehicles/access-vehicles.component';
import { AccessVehicleDetailComponent } from './access-vehicles/access-vehicle-detail/access-vehicle-detail.component';

@NgModule({
  declarations: [AccessVehiclesComponent, AccessVehicleDetailComponent],
  imports: [CommonModule, SharedModule, RequestEntryRoutingModule],
})
export class RequestEntryModule {}
