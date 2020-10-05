import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestEntryRoutingModule } from './request-entry-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, RequestEntryRoutingModule],
})
export class RequestEntryModule {}
