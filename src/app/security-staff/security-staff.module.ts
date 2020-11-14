import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityStaffRoutingModule } from './security-staff-routing.module';
import { RequestEntryComponent } from './request-entry/request-entry.component';
import { SharedModule } from '@app/shared/shared.module';
import { UpdateRequestEntryComponent } from './request-entry/update-request-entry/update-request-entry.component';

@NgModule({
  declarations: [RequestEntryComponent, UpdateRequestEntryComponent],
  imports: [CommonModule, SharedModule, SecurityStaffRoutingModule]
})
export class SecurityStaffModule {}
