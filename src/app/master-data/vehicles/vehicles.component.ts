import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Vehicle } from '@app/shared/classes/vehicle';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  columns = [
    { key: 'Plate', display: 'Plate' },
    { key: 'Name', display: 'Name' },
    { key: 'ContactName', display: 'Contact Name' },
    { key: 'DateOfPayment', display: 'Payment Date', type: 'date' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'IsApproved', display: 'Is Approved', type: 'boolean' },
    { key: 'WhoApproved', display: 'Approver' },
    { key: 'DateApproved', display: 'Approval Date' },
  ];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getVehiclesByCustomer(this.authService.currentUserValue.CustomerId);
  }

  getVehiclesByCustomer(customerId: number): void {
    this.vehicleService.getVehiclesByCustomer(customerId).subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
  }

  addNew(): void {
    this.router.navigate(['master-data/vehicles/detail', CrudType.CREATE]);
  }

  viewDetail(vehicle: Vehicle): void {
    this.router.navigate(['master-data/vehicles/detail', CrudType.VIEW, vehicle.Id]);
  }

  editVehicle(vehicle: Vehicle): void {
    this.router.navigate(['master-data/vehicles/detail', CrudType.EDIT, vehicle.Id]);
  }

  deleteVehicle(vehicle: Vehicle): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this vehicle?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
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
