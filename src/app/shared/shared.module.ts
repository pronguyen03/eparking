import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { BooleanPipe } from './pipes/boolean.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const components = [DataTableComponent, ConfirmDialogComponent];
const modules = [NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule, FontAwesomeModule];
const directives = [HasRoleDirective];
const pipes = [BooleanPipe];
@NgModule({
  declarations: [...components, ...directives, CustomDatePipe, pipes],
  imports: [CommonModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule, ...modules],
  exports: [MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule, ...modules, ...components, ...directives, ...pipes],
})
export class SharedModule {}
