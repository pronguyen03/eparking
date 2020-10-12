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
import { Observable } from 'rxjs';
import { differenceInMinutes } from 'date-fns';
import { TimeService } from '@app/shared/services/time.service';
import { IRequestEntry } from '@app/shared/interfaces/request-entry';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';

@Component({
  selector: 'app-request-entry',
  templateUrl: './request-entry.component.html',
  styleUrls: ['./request-entry.component.scss'],
})
export class RequestEntryComponent implements OnInit {
  listRequests: IRequestEntry[] = [];
  errorForm = false;
  columns = [
    { key: 'RequestDetailed', display: 'Request Detail' },
    { key: 'VisitorName', display: 'Visitor Name' },
    { key: 'NumberVisitor', display: 'No. Of Visitors' },
    { key: 'StartTime', display: 'Start Time', type: 'date' },
    { key: 'EndTime', display: 'End Time', type: 'date' },
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

  getRequestsByCustomer(customerId: number, fromDate: string, toDate: string, vehicleType: number): void {
    this.requestEntryService
      .getRequestsByCustomer(customerId, fromDate, toDate, vehicleType)
      .subscribe((listRequests) => {
        this.listRequests = listRequests;
      });
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
            this.listRequests = this.listRequests.filter((value) => value.Id !== request.Id);
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

    this.getRequestsByCustomer(this.authService.currentUserValue.CustomerId, FromDate, ToDate, Type);
  }

  resetSearchForm(): void {
    this.searchForm.reset();
    this.errorForm = false;
  }
}
