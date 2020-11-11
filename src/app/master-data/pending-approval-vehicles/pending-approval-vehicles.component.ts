import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicle } from '@app/shared/interfaces/vehicle';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-pending-approval-vehicles',
  templateUrl: './pending-approval-vehicles.component.html',
  styleUrls: ['./pending-approval-vehicles.component.scss']
})
export class PendingApprovalVehiclesComponent implements OnInit {
  vehicles: IVehicle[] = [];
  columns: ITableCol[] = [
    { key: 'Plate', display: 'Plate', filterable: true, filterType: 'input' },
    { key: 'Name', display: 'Name' },
    { key: 'ContactName', display: 'Contact Name' },
    { key: 'DateOfPayment', display: 'Payment Date', type: 'date' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'StatusName', display: 'Status'},
    // { key: 'IsApproved', display: 'Is Approved', type: 'boolean' },
    // { key: 'WhoApproved', display: 'Approver' },
    // { key: 'DateApproved', display: 'Approval Date' },
  ];
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private vehicleService: VehicleService,
  ) { }


  ngOnInit(): void {
    if (this.authService.currentUserValue.RoleId === Role.PARKING_ADMIN || this.authService.currentUserValue.RoleId === Role.SYSTEM_ADMIN) {
      this.getVehiclesByParking(environment.parkingId);
    }
  }

  getVehiclesByParking(parkingId: number): void {
    this.vehicleService.getVehiclesByParking(parkingId).subscribe((vehicles) => {
      vehicles = vehicles.filter(vehicle => vehicle.Status === VehicleStatus.PENDING).map(vehicle => {
          vehicle.StatusName = 'Pending Approval';
          vehicle.canDelete = false;
          return vehicle;
      });
      this.vehicles = vehicles;
    });
  }

  viewDetail(vehicle: IVehicle): void {
    this.router.navigate(['master-data/pending-approval-vehicles/detail', CrudType.VIEW, vehicle.Id]);
  }

  editVehicle(vehicle: IVehicle): void {
    this.router.navigate(['master-data/pending-approval-vehicles/detail', CrudType.EDIT, vehicle.Id]);
  }

}
