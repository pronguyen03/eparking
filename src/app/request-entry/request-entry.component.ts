import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { RequestEntryService } from '@app/shared/services/request-entry.service';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { differenceInMinutes } from 'date-fns';
import { TimeService } from '@app/shared/services/time.service';
import { IRequestEntry } from '@app/shared/interfaces/request-entry';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.scss'],
})
export class RequestEntryComponent implements OnInit {
  listRequests$: Observable<IRequestEntry[]>;
  errorForm = false;
  columns = [
    { key: 'RequestDetailed', display: 'Request Detail' },
    { key: 'VisitorName', display: 'Visitor Name' },
    { key: 'NumberVisitor', display: 'No. Of Visitors' },
    { key: 'StartTime', display: 'Start Time', type: 'dateTimeString' },
    { key: 'EndTime', display: 'End Time', type: 'dateTimeString' },
    { key: 'CustomerName', display: 'Customer Name' },
  ];

  vehicleCategories$: Observable<IVehicleCategory[]>;
  searchForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private requestEntryService: RequestEntryService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private vehicleCategoryService: VehicleCategoryService,
    private timeService: TimeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesCategories(environment.parkingId);

    this.listRequests$ = this.requestEntryService.getFilterValue().pipe(
      switchMap(filterValue => {
        if (Object.keys(filterValue).length === 0 && filterValue.constructor === Object) {
          return of(null);
        }

        return this.getRequestsByCustomer(filterValue.CustomerId,
          filterValue.FromDate, filterValue.ToDate, filterValue.Type);
      })
    );
  }

  getVehiclesCategories(parkingId: number): void {
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId);
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      Type: [0, Validators.required],
    });
  }

  getRequestsByCustomer(customerId: number, fromDate: string, toDate: string, vehicleType: number): Observable<IRequestEntry[]> {
    return this.requestEntryService
      .getRequestsByCustomer(customerId, fromDate, toDate, vehicleType);
  }

  addNew(): void {
    this.router.navigate(['request-entry/detail', CrudType.CREATE]);
  }

  viewDetail(request: IRequestEntry): void {
    this.router.navigate(['request-entry/detail', CrudType.VIEW, request.Id]);
  }

  editRequest(request: IRequestEntry): void {
    this.router.navigate(['request-entry/detail', CrudType.EDIT, request.Id]);
  }

  deleteRequest(request: IRequestEntry): void {
    if (differenceInMinutes(this.timeService.convertToDateTime(request.EndTime), new Date()) < 0) {
      this.toastr.error('Can not delete the request. This one is expired.');
      return;
    }
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this request entry?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
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

    const Type = this.searchForm.value.Type;
    FromDate = this.timeService.toDateTimeString(new Date(FromDate));
    ToDate = this.timeService.toDateTimeString(new Date(ToDate));
    const filterValue = {
      CustomerId: this.authService.currentUserValue.CustomerId,
      FromDate, ToDate, Type
    };
    this.requestEntryService.filterSubject.next(filterValue);
  }

  resetSearchForm(): void {
    this.searchForm.reset();
    this.errorForm = false;
  }
}
