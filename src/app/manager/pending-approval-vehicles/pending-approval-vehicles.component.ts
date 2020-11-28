import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { VehicleStatus } from '@app/shared/enums/vehicle-status.enum';
import { ICustomer } from '@app/shared/interfaces/customer';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicle } from '@app/shared/interfaces/vehicle';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { CustomerService } from '@app/shared/services/customer.service';
import { VehicleService } from '@app/shared/services/vehicle.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subscription, timer } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-pending-approval-vehicles',
  templateUrl: './pending-approval-vehicles.component.html',
  styleUrls: ['./pending-approval-vehicles.component.scss']
})
export class PendingApprovalVehiclesComponent implements OnInit {
  vehicles: IVehicle[] = [];
  columns: ITableCol[] = [
    { key: 'Plate', display: 'Plate', filterable: true },
    { key: 'CustomerName', display: 'Customer_Name', filterable: true, filterType: 'text' },
    { key: 'Name', display: 'Name', filterable: true, filterType: 'text' },
    { key: 'DateOfPayment', display: 'Payment_Date', type: 'date', filterable: true, filterType: 'date' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'StatusName', display: 'Status', isTranslated: true, filterable: false }
  ];

  searchForm: FormGroup;
  vehicleSubscription: Subscription;
  customers$: Observable<ICustomer[]>;

  filterSubject = new BehaviorSubject<number>(null);
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.customers$ = this.customerService.getCustomerByParking(environment.parkingId);
    this.getVehiclesByParking(environment.parkingId, VehicleStatus.PENDING);
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      CustomerName: [''],
      CustomerId: [null]
    });
  }

  getVehiclesByParking(parkingId: number, status: VehicleStatus): void {
    this.vehicleSubscription = this.filterSubject
      .asObservable()
      .pipe(
        switchMap((customerId) => {
          if (customerId) {
            return this.getVehiclesByCustomer(customerId);
          } else {
            return this.vehicleService.getVehiclesByParking(parkingId, status);
          }
        }),
        map((data) => {
          return data?.filter((vehicle) => vehicle.Status === status);
        })
      )
      // timer(0, 30000)
      //   .pipe(
      //     switchMap(() =>
      //       combineLatest([
      //         this.vehicleService.getVehiclesByParking(parkingId, status),
      //         this.searchForm.valueChanges.pipe(startWith([]))
      //       ])
      //     ),
      //     map((data) => {
      //       let vehicles = data[0];
      //       const customerName = this.searchForm.value.CustomerName;
      //       if (customerName) {
      //         vehicles = vehicles.filter((vehicle) =>
      //           vehicle.CustomerName.toLowerCase().includes(customerName.toLowerCase())
      //         );
      //       }
      //       return vehicles;
      //     })
      //   )
      .subscribe((vehicles) => {
        vehicles = vehicles.map((vehicle) => {
          vehicle.StatusName = 'Pending_Approval';
          vehicle.canDelete = false;
          return vehicle;
        });
        this.vehicles = vehicles;
      });
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

  getFilteredList(): void {
    const { CustomerId } = this.searchForm.value;
    this.filterSubject.next(CustomerId);
  }

  getVehiclesByCustomer(customerId: number): Observable<IVehicle[]> {
    return this.vehicleService.getVehiclesByCustomer(customerId);
  }
}
