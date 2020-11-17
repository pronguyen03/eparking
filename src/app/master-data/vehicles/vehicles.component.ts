import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicle } from '@app/shared/interfaces/vehicle';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  vehicles: IVehicle[] = [];
  columns: ITableCol[] = [
    { key: 'Plate', display: 'Plate', filterable: true, filterType: 'input' },
    { key: 'Name', display: 'Name' },
    { key: 'ContactName', display: 'Contact Name' },
    { key: 'DateOfPayment', display: 'Payment Date', type: 'date' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'StatusName', display: 'Status' },
    // { key: 'IsApproved', display: 'Is Approved', type: 'boolean' },
    { key: 'WhoApproved', display: 'Approver' },
    { key: 'DateApproved', display: 'Approval Date' }
  ];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (
      this.authService.currentUserValue.RoleId === Role.PARKING_ADMIN ||
      this.authService.currentUserValue.RoleId === Role.SYSTEM_ADMIN
    ) {
      this.getVehiclesByParking(environment.parkingId, VehicleStatus.APPROVED);
    } else {
      this.getVehiclesByCustomer(this.authService.currentUserValue.CustomerId);
    }
  }

  getVehiclesByParking(parkingId: number, status: VehicleStatus): void {
    this.vehicleService.getVehiclesByParking(parkingId, status).subscribe((vehicles) => {
      vehicles = vehicles.map((vehicle) => {
        switch (vehicle.Status) {
          case VehicleStatus.NEW:
            vehicle.StatusName = 'New';
            break;
          case VehicleStatus.PENDING:
            vehicle.StatusName = 'Pending Approval';
            vehicle.canDelete = false;
            break;
          case VehicleStatus.APPROVED:
            vehicle.StatusName = 'Approved';
            vehicle.canDelete = false;
            break;
          default:
            vehicle.StatusName = 'New';
            break;
        }
        return vehicle;
      });
      this.vehicles = vehicles;
    });
  }

  getVehiclesByCustomer(customerId: number): void {
    this.vehicleService.getVehiclesByCustomer(customerId).subscribe((vehicles) => {
      vehicles = vehicles.map((vehicle) => {
        switch (vehicle.Status) {
          case VehicleStatus.NEW:
            vehicle.StatusName = 'New';
            break;
          case VehicleStatus.PENDING:
            vehicle.StatusName = 'Pending Approval';
            vehicle.canDelete = false;
            break;
          case VehicleStatus.APPROVED:
            vehicle.StatusName = 'Approved';
            vehicle.canDelete = false;
            break;
          default:
            vehicle.StatusName = 'New';
            break;
        }
        return vehicle;
      });
      this.vehicles = vehicles;
    });
  }

  addNew(): void {
    this.router.navigate(['master-data/vehicles/detail', CrudType.CREATE]);
  }

  viewDetail(vehicle: IVehicle): void {
    this.router.navigate(['master-data/vehicles/detail', CrudType.VIEW, vehicle.Id]);
  }

  editVehicle(vehicle: IVehicle): void {
    this.router.navigate(['master-data/vehicles/detail', CrudType.EDIT, vehicle.Id]);
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
}
