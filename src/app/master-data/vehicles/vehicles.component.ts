import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vehicle } from '@app/shared/classes/vehicle';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleService } from '@app/shared/services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  columns = [
    { key: 'Plate', display: 'Plate' },
    { key: 'TypeId', display: 'Type' },
    { key: 'CustomerName', display: 'Customer Name' },
    { key: 'DateOfPayment', display: 'Payment Date', type: 'date' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'IsApproved', display: 'Is Approved', type: 'boolean' },
    { key: 'WhoApproved', display: 'Approver' },
    { key: 'DateApproved', display: 'Approval Date' },
  ];

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getVehiclesByCustomer(this.authService.currentUserValue.CustomerId);
  }

  getVehiclesByCustomer(customerId: number): void {
    this.vehicleService.getVehiclesByCustomer(customerId).subscribe((vehicles) => {
      this.vehicles = vehicles;
      console.log(this.vehicles);
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
    // this.router.navigate(['master-data/vehicles/detail', CrudType.VIEW, vehicle.Id]);
  }
}
