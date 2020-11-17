import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { PendingApprovalVehicleDetailComponent } from './pending-approval-vehicles/pending-approval-vehicle-detail/pending-approval-vehicle-detail.component';
import { PendingApprovalVehiclesComponent } from './pending-approval-vehicles/pending-approval-vehicles.component';
import { SharedModule } from '@app/shared/shared.module';
import { InactiveVehicleDetailComponent } from './inactive-vehicles/inactive-vehicle-detail/inactive-vehicle-detail.component';
import { InactiveVehiclesComponent } from './inactive-vehicles/inactive-vehicles.component';

@NgModule({
  declarations: [
    PendingApprovalVehiclesComponent,
    PendingApprovalVehicleDetailComponent,
    InactiveVehicleDetailComponent,
    InactiveVehiclesComponent
  ],
  imports: [CommonModule, ManagerRoutingModule, SharedModule]
})
export class ManagerModule {}
