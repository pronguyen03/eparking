import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-categories',
  templateUrl: './vehicle-categories.component.html',
  styleUrls: ['./vehicle-categories.component.scss']
})
export class VehicleCategoriesComponent implements OnInit {
  categories: IVehicleCategory[] = [];

  columns: ITableCol[] = [
    { key: 'Id', display: 'Id' },
    { key: 'Name', display: 'Name' },
    { key: 'Description', display: 'Description' },
  ];

  constructor(
    private vehicleCategoryService: VehicleCategoryService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getVehicleCategoriesByParking(environment.parkingId);
  }

  getVehicleCategoriesByParking(parkingId: number): void {
    this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId).subscribe((categories) => {
      this.categories = categories;
    });
  }

  addNew(): void {
    this.router.navigate(['master-data/vehicle-categories/detail', CrudType.CREATE]);
  }

  viewDetail(category: IVehicleCategory): void {
    this.router.navigate(['master-data/vehicle-categories/detail', CrudType.VIEW, category.Id]);
  }

  editCategory(category: IVehicleCategory): void {
    this.router.navigate(['master-data/vehicle-categories/detail', CrudType.EDIT, category.Id]);
  }

  deleteCategory(category: IVehicleCategory): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this vehicle category?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.vehicleCategoryService.deleteCategory(category.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Employee');
            this.categories = this.categories.filter((value) => value.Id !== category.Id);
          }
        });
      }
    });
  }


}
