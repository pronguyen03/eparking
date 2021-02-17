import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ConfirmDialogModel,
  ConfirmDialogComponent
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { IRequestEntry } from '@app/shared/interfaces/request-entry';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { ReportService } from '@app/shared/services/report.service';
import { RequestEntryService } from '@app/shared/services/request-entry.service';
import { TimeService } from '@app/shared/services/time.service';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { environment } from '@environments/environment';
import { differenceInMinutes, format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
    { key: 'VisitorPassport', display: 'Hộ Chiếu/CMND Người Ra Vào' },
    { key: 'NumberVisitor', display: 'Số Lượng Người Ra Vào' },
    { key: 'CustomerName', display: 'Tên Khách Hàng' },
    { key: 'VisitorTel', display: 'Số Điện Thoại Người Ra Vào' }
  ];
  errorForm = false;
  columns: ITableCol[] = [
    { key: 'RequestDetailed', display: 'Request_Detail', filterable: true, width: '20%' },
    { key: 'VisitorName', display: 'Visitor_Name', filterable: true },
    { key: 'VisitorPassport', display: 'Visitor_Passport', filterable: true },
    { key: 'NumberVisitor', display: 'Number_Of_Visitors', filterable: true, filterType: 'number' },
    { key: 'CustomerName', display: 'Customer_Name', filterable: true },
    { key: 'VisitorTel', display: 'Visitor_Tel_No', filterable: true }
  ];

  vehicleCategories$: Observable<IVehicleCategory[]>;
  searchForm: FormGroup;
  Role = Role;
  constructor(
    private authService: AuthenticationService,
    private requestEntryService: RequestEntryService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private vehicleCategoryService: VehicleCategoryService,
    private timeService: TimeService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesCategories(environment.parkingId);
    this.getFilteredList();

    this.listRequests$ = combineLatest([timer(0, 30000), this.requestEntryService.getFilterValue()]).pipe(
      map((data) => data[1]),
      switchMap((filterValue) => {
        if (Object.keys(filterValue).length === 0 && filterValue.constructor === Object) {
          return of(null);
        }
        return this.getRequestsByParking(
          environment.parkingId,
          filterValue.FromDate,
          filterValue.ToDate,
          filterValue.Type
        );
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

  getVehiclesCategories(parkingId: number): void {
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId);
  }

  initForm(): void {
    this.searchForm = this.fb.group({
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

    const Type = this.searchForm.value.Type;
    FromDate = this.timeService.toDateTimeString(new Date(FromDate));
    ToDate = this.timeService.toDateTimeString(new Date(ToDate));
    const filterValue = {
      CustomerId: this.authService.currentUserValue.CustomerId,
      FromDate,
      ToDate,
      Type
    };
    this.requestEntryService.filterSubject.next(filterValue);
  }

  resetSearchForm(): void {
    this.searchForm.reset();
    this.errorForm = false;
  }

  setDefaultFilter(): void {
    const filterValue = {
      CustomerId: this.authService.currentUserValue.CustomerId,
      FromDate: this.timeService.toDateTimeString(new Date()),
      ToDate: this.timeService.toDateTimeString(new Date()),
      Type: this.searchForm.value.Type
    };
    this.requestEntryService.filterSubject.next(filterValue);
  }

  exportFile(): void {
    this.reportService.exportFile(this.listExport, this.exportHeader, 'Dang_Ky_Vao_Ra');
  }
}
