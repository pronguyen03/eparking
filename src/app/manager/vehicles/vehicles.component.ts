import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ConfirmDialogModel,
  ConfirmDialogComponent
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicle } from '@app/shared/interfaces/vehicle';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subscription, timer } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit, OnDestroy {
  vehicles: IVehicle[] = [];
  columns: ITableCol[] = [
    { key: 'Plate', display: 'Plate' },
    { key: 'CustomerName', display: 'Customer_Name', filterable: true, filterType: 'input' },
    { key: 'Name', display: 'Vehicle_Name' },
    { key: 'DateOfPayment', display: 'Payment_Date', type: 'date' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'StatusName', display: 'Status', isTranslated: true },
    { key: 'WhoApproved', display: 'Approver' },
    { key: 'DateApproved', display: 'Approval_Date' }
  ];

  searchForm: FormGroup;
  vehicleSubscription: Subscription;
  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesByParking(environment.parkingId, VehicleStatus.APPROVED);
  }

  ngOnDestroy(): void {
    this.vehicleSubscription?.unsubscribe();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      CustomerName: [null]
    });
  }

  getVehiclesByParking(parkingId: number, status: VehicleStatus): void {
    this.vehicleSubscription = timer(0, 30000)
      .pipe(
        switchMap(() =>
          combineLatest([
            this.vehicleService.getVehiclesByParking(parkingId, status),
            this.searchForm.valueChanges.pipe(startWith([]))
          ])
        ),
        map((data) => {
          let vehicles = data[0];
          const customerName = data[1].CustomerName;
          if (customerName) {
            vehicles = vehicles.filter((vehicle) =>
              vehicle.CustomerName.toLowerCase().includes(customerName.toLowerCase())
            );
          }
          return vehicles;
        })
      )
      .subscribe((vehicles) => {
        vehicles = vehicles.map((vehicle) => {
          switch (vehicle.Status) {
            case VehicleStatus.NEW:
              vehicle.StatusName = 'New';
              break;
            case VehicleStatus.PENDING:
              vehicle.StatusName = 'Pending_Approval';
              vehicle.canDelete = false;
              break;
            case VehicleStatus.APPROVED:
              vehicle.StatusName = 'Approved';
              vehicle.canDelete = false;
              vehicle.canEdit = false;
              break;
            default:
              vehicle.StatusName = 'New';
              break;
          }
          return vehicle;
        });
        this.vehicles = vehicles;
      });
    this.searchForm.reset();
  }

  viewDetail(vehicle: IVehicle): void {
    this.router.navigate(['manager/vehicles/detail', CrudType.VIEW, vehicle.Id]);
  }

  editVehicle(vehicle: IVehicle): void {
    this.router.navigate(['manager/vehicles/detail', CrudType.EDIT, vehicle.Id]);
  }

  deleteVehicle(vehicle: IVehicle): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this vehicle?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.vehicleService.deleteVehicle(vehicle.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Vehicle');
            this.vehicles = this.vehicles.filter((value) => value.Id !== vehicle.Id);
          }
        });
      }
    });
  }

  resetSearchForm(): void {
    this.searchForm.reset();
  }
}
