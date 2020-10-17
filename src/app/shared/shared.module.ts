import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { BooleanPipe } from './pipes/boolean.pipe';

const components = [DataTableComponent, ConfirmDialogComponent];
const modules = [NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule];
const directives = [HasRoleDirective];
const pipes = [BooleanPipe];
@NgModule({
  declarations: [...components, ...directives, CustomDatePipe, pipes],
  imports: [CommonModule, MaterialModule, FlexLayoutModule, ReactiveFormsModule, ...modules],
  exports: [MaterialModule, FlexLayoutModule, ReactiveFormsModule, ...modules, ...components, ...directives, ...pipes],
})
export class SharedModule {}
