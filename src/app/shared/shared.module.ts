import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from './directives/has-role.directive';

const components = [DataTableComponent, ConfirmDialogComponent];

const directives = [HasRoleDirective];
@NgModule({
  declarations: [...components, ...directives],
  imports: [CommonModule, MaterialModule, FlexLayoutModule, ReactiveFormsModule],
  exports: [MaterialModule, FlexLayoutModule, ReactiveFormsModule, ...components, ...directives],
})
export class SharedModule {}
