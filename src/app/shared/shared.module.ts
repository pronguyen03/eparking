import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

const components = [DataTableComponent];
@NgModule({
  declarations: [DataTableComponent, ConfirmDialogComponent],
  imports: [CommonModule, MaterialModule, FlexLayoutModule, ReactiveFormsModule],
  exports: [MaterialModule, DataTableComponent, FlexLayoutModule, ReactiveFormsModule],
})
export class SharedModule {}
