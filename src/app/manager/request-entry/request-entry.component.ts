import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import {
  ConfirmDialogModel,
  ConfirmDialogComponent
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { ISelectionConfig } from '@app/shared/components/select-with-filter/selection-config';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { ICustomer } from '@app/shared/interfaces/customer';
import { IRequestEntry } from '@app/shared/interfaces/request-entry';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { CustomerService } from '@app/shared/services/customer.service';
import { ReportService } from '@app/shared/services/report.service';
import { RequestEntryService } from '@app/shared/services/request-entry.service';
import { TimeService } from '@app/shared/services/time.service';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { environment } from '@environments/environment';
import { differenceInMinutes, format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, ObservableLike, of, ReplaySubject, Subject, timer } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.scss']
})
export class RequestEntryComponent implements OnInit {
  listRequests$: Observable<IRequestEntry[]>;
  listExport: IRequestEntry[] = [];
  exportHeader = [
    { key: 'RequestDetailed', display: 'Chi Tiết Yêu Cầu' },
    { key: 'VisitorName', display: 'Tên Người Ra Vào' },
    { key: 'Plate', display: 'Biển Số' },
    { key: 'VisitorPassport', display: 'Hộ Chiếu/CMND Người Ra Vào' },
    { key: 'NumberVisitor', display: 'Số Lượng Người Ra Vào' },
    { key: 'CustomerName', display: 'Tên Khách Hàng' },
    { key: 'VisitorTel', display: 'Số Điện Thoại Người Ra Vào' }
  ];
  errorForm = false;
  columns: ITableCol[] = [
    { key: 'RequestDetailed', display: 'Request_Detail', filterable: true, width: '20%' },
    { key: 'VisitorName', display: 'Visitor_Name', filterable: true },
    { key: 'Plate', display: 'Plate', filterable: true },
    { key: 'VisitorPassport', display: 'Visitor_Passport', filterable: true },
    { key: 'NumberVisitor', display: 'Number_Of_Visitors', filterable: true, filterType: 'number' },
    { key: 'CustomerName', display: 'Customer_Name', filterable: true },
    { key: 'VisitorTel', display: 'Visitor_Tel_No', filterable: true }
  ];

  vehicleCategories$: Observable<IVehicleCategory[]>;
  customers: ICustomer[];
  searchForm: FormGroup;
  Role = Role;

  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public customerFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredCustomers: ReplaySubject<ICustomer[]> = new ReplaySubject<ICustomer[]>(1);

  @ViewChild('customerSelect', { static: true }) customerSelect: MatSelect;

  customerSelectConfig: ISelectionConfig = {
    valueKey: 'CustomerId',
    displayKey: 'CustomerName'
  };

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  constructor(
    private authService: AuthenticationService,
    private requestEntryService: RequestEntryService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private vehicleCategoryService: VehicleCategoryService,
    private timeService: TimeService,
    private reportService: ReportService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesCategories(environment.parkingId);
    this.initFilteredCustomer(environment.parkingId);
    this.getFilteredList();

    this.listRequests$ = combineLatest([timer(0, 30000), this.requestEntryService.getFilterValue()]).pipe(
      map((data) => data[1]),
      switchMap((filterValue) => {
        if (Object.keys(filterValue).length === 0 && filterValue.constructor === Object) {
          return of(null);
        }
        if (filterValue.CustomerId) {
          return this.getRequestsByCustomer(
            filterValue.CustomerId,
            filterValue.FromDate,
            filterValue.ToDate,
            filterValue.Type
          );
        } else {
          return this.getRequestsByParking(
            environment.parkingId,
            filterValue.FromDate,
            filterValue.ToDate,
            filterValue.Type
          );
        }
      }),
      map((requests: IRequestEntry[]) => {
        this.listExport = [...requests];
        return requests?.map((request) => {
          request.canDelete = false;
          request.backGroundColor = request.IsDone ? '#fff3cd' : 'inherit';
          return request;
        });
      })
    );
  }

  // ngAfterViewInit() {
  //   this.setInitialValueCustomer();
  // }

  // protected setInitialValueCustomer() {
  //   this.filteredCustomers.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
  //     // setting the compareWith property to a comparison function
  //     // triggers initializing the selection according to the initial value of
  //     // the form control (i.e. _initializeSelection())
  //     // this needs to be done after the filteredBanks are loaded initially
  //     // and after the mat-option elements are available
  //     this.customerSelect.compareWith = (a: ICustomer, b: ICustomer) => a && b && a.CustomerId === b.CustomerId;
  //   });
  // }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getVehiclesCategories(parkingId: number): void {
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId);
  }

  initFilteredCustomer(parkingId: number): void {
    this.customerService.getCustomerByParking(parkingId).subscribe((customers) => {
      this.customers = customers;
      this.filteredCustomers.next(customers.slice());
    });

    this.customerFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterCustomers();
    });
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      CustomerId: [null],
      FromDate: [new Date(), Validators.required],
      ToDate: [new Date(), Validators.required],
      Type: [0, Validators.required]
    });
  }

  getRequestsByParking(
    parkingId: number,
    fromDate: string,
    toDate: string,
    vehicleType: number
  ): Observable<IRequestEntry[]> {
    return this.requestEntryService.getRequestsByParking(parkingId, fromDate, toDate, vehicleType);
  }

  getRequestsByCustomer(customerId: number, fromDate: string, toDate: string, vehicleType: number) {
    return this.requestEntryService.getRequestsByCustomer(customerId, fromDate, toDate, vehicleType);
  }

  viewDetail(request: IRequestEntry): void {
    this.router.navigate(['request-entry/detail', CrudType.VIEW, request.Id], { queryParams: { isManager: true } });
  }

  editRequest(request: IRequestEntry): void {
    this.router.navigate(['request-entry/detail', CrudType.EDIT, request.Id], { queryParams: { isManager: true } });
  }

  deleteRequest(request: IRequestEntry): void {
    if (differenceInMinutes(this.timeService.convertToDateTime(request.EndTime), new Date()) < 0) {
      this.toastr.error('Can not delete the request. This one is expired.');
      return;
    }
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this request entry?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.requestEntryService.deleteRequestEntry(request.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Employee');
            this.requestEntryService.filterSubject.next(this.requestEntryService.filterSubject.value);
            // this.listRequests = this.listRequests.filter((value) => value.Id !== request.Id);
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
    let { FromDate, ToDate } = this.searchForm.value;

    const { Type, CustomerId } = this.searchForm.value;
    FromDate = this.timeService.toDateTimeString(new Date(FromDate));
    ToDate = this.timeService.toDateTimeString(new Date(ToDate));
    const filterValue = {
      CustomerId,
      FromDate,
      ToDate,
      Type
    };
    this.requestEntryService.filterSubject.next(filterValue);
  }

  resetSearchForm(): void {
    this.searchForm.reset();
    this.errorForm = false;
    this.searchForm.patchValue({
      Type: 0 // Default
    });
  }

  setDefaultFilter(): void {
    const filterValue = {
      CustomerId: null,
      FromDate: this.timeService.toDateTimeString(new Date()),
      ToDate: this.timeService.toDateTimeString(new Date()),
      Type: this.searchForm.value.Type
    };
    this.requestEntryService.filterSubject.next(filterValue);
  }

  exportFile(): void {
    this.reportService.exportFile(this.listExport, this.exportHeader, 'Dang_Ky_Vao_Ra');
  }

  protected filterCustomers() {
    if (!this.customers) {
      return;
    }
    // get the search keyword
    let search = this.customerFilterCtrl.value;
    if (!search) {
      this.filteredCustomers.next(this.customers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCustomers.next(
      this.customers.filter((customer) => customer.CustomerName.toLowerCase().indexOf(search) > -1)
    );
  }

  reportDetail(): void {
    if (this.searchForm.invalid) {
      this.errorForm = true;
      return;
    }
    let { FromDate, ToDate } = this.searchForm.value;

    const { CustomerId } = this.searchForm.value;
    FromDate = this.timeService.toDateTimeString(new Date(FromDate));
    ToDate = this.timeService.toDateTimeString(new Date(ToDate));
    this.requestEntryService.reportDetail(CustomerId || 0, environment.parkingId, FromDate, ToDate).subscribe(data => {
      this.reportService.exportFile(data, this.exportHeader, 'Bao_Cao_Chi_Tiet');
    })
  }
}
