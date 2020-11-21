import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { IAccessVehicle } from '@app/shared/interfaces/access-vehicle';
import { IRequestEntry } from '@app/shared/interfaces/request-entry';
import { AccessVehicleService } from '@app/shared/services/access-vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-access-vehicles',
  templateUrl: './access-vehicles.component.html',
  styleUrls: ['./access-vehicles.component.scss']
})
export class AccessVehiclesComponent implements OnInit {
  requestsEntry$: Observable<IRequestEntry[]>;
  errorForm = false;
  accessVehicles: IAccessVehicle[] = [];
  searchForm: FormGroup;
  columns = [
    { key: 'Id', display: 'ID' },
    { key: 'RepuestEntryId', display: 'Repuest_Entry_Id' },
    { key: 'Plate', display: 'Plate' },
    { key: 'Name', display: 'Type' }
  ];
  constructor(
    private fb: FormBuilder,
    private accessVehicleService: AccessVehicleService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  getAccessVehiclesByRequestId(requestId: number): void {
    this.accessVehicleService.getAccessVehiclesByRequestId(requestId).subscribe((accessVehicles) => {
      this.accessVehicles = accessVehicles;
    });
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      RepuestEntryId: ['', Validators.required]
    });
  }

  addNew(): void {
    this.router.navigate(['request-entry/access-vehicles/detail', CrudType.CREATE]);
  }

  viewDetail(vehicle: IAccessVehicle): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Id: vehicle.Id,
        RequestEntryId: vehicle.RequestEntryId,
        Plate: vehicle.Plate,
        TypeId: vehicle.TypeId
      }
    };
    this.router.navigate(['request-entry/access-vehicles/detail', CrudType.VIEW], navigationExtras);
  }

  editAccessVehicle(vehicle: IAccessVehicle): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Id: vehicle.Id,
        RequestEntryId: vehicle.RequestEntryId,
        Plate: vehicle.Plate,
        TypeId: vehicle.TypeId
      }
    };
    this.router.navigate(['request-entry/access-vehicles/detail', CrudType.EDIT], navigationExtras);
  }

  deleteAccessVehicle(vehicle: IAccessVehicle): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this access vehicle?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.accessVehicleService.deleteAccessVehicle(vehicle.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Vehicle');
            this.accessVehicles = this.accessVehicles.filter((value) => value.Id !== vehicle.Id);
          }
        });
      }
    });
  }

  getFilteredList(): void {
    if (this.searchForm.invalid) {
      this.errorForm = true;
      return;
    }
    const { RepuestEntryId } = this.searchForm.value;

    this.getAccessVehiclesByRequestId(RepuestEntryId);
  }

  resetSearchForm(): void {
    this.searchForm.reset();
    this.errorForm = false;
  }
}
