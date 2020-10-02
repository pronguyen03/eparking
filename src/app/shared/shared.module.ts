import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const components = [
  DataTableComponent
];
@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    MaterialModule,
    DataTableComponent,
    FlexLayoutModule
  ]
})
export class SharedModule { }
