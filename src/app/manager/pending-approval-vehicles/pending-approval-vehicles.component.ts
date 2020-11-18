import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicle } from '@app/shared/interfaces/vehicle';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pending-approval-vehicles',
  templateUrl: './pending-approval-vehicles.component.html',
  styleUrls: ['./pending-approval-vehicles.component.scss']
})
export class PendingApprovalVehiclesComponent implements OnInit {
  vehicles: IVehicle[] = [];
  columns: ITableCol[] = [
    { key: 'Plate', display: 'Plate' },
    { key: 'CustomerName', display: 'Customer Name', filterable: true, filterType: 'input' },
    { key: 'Name', display: 'Name' },
    { key: 'DateOfPayment', display: 'Payment Date', type: 'date' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'StatusName', display: 'Status' }
  ];

  searchForm: FormGroup;
  vehicleSubscription: Subscription;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private vehicleService: VehicleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesByParking(environment.parkingId, VehicleStatus.PENDING);
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      CustomerName: [null]
    });
  }

  getVehiclesByParking(parkingId: number, status: VehicleStatus): void {
    this.vehicleSubscription = combineLatest([
      this.vehicleService.getVehiclesByParking(parkingId, status),
      this.searchForm.valueChanges
    ])
      .pipe(
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
          vehicle.StatusName = 'Pending Approval';
          vehicle.canDelete = false;
          return vehicle;
        });
        this.vehicles = vehicles;
      });
    this.searchForm.reset();
  }

  viewDetail(vehicle: IVehicle): void {
    this.router.navigate(['manager/pending-approval-vehicles/detail', CrudType.VIEW, vehicle.Id]);
  }

  editVehicle(vehicle: IVehicle): void {
    this.router.navigate(['manager/pending-approval-vehicles/detail', CrudType.EDIT, vehicle.Id]);
  }

  resetSearchForm(): void {
    this.searchForm.reset();
  }
}
