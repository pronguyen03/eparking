import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { YesNo } from '@app/shared/enums/yes-no.enum';
import { ICustomer } from '@app/shared/interfaces/customer';
import { CustomerService } from '@app/shared/services/customer.service';
import { PriceService } from '@app/shared/services/price.service';
import { RoleService } from '@app/shared/services/role.service';
import { TimeService } from '@app/shared/services/time.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { IVehicleCategory } from '@app/shared/interfaces/vehicle-category';
import { IPriceDetail } from '@app/shared/interfaces/price-detail';
import { PriceDetailService } from '@app/shared/services/price-detail.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-price-detail',
  templateUrl: './price-detail.component.html',
  styleUrls: ['./price-detail.component.scss']
})
export class PriceDetailComponent implements OnInit {
  CrudType = CrudType;
  priceForm: FormGroup;
  vehicleCategories$: Observable<IVehicleCategory[]>;
  priceDetailForm: FormGroup;
  crudType: CrudType;
  id: number;
  listPrices: Partial<IPriceDetail>[] = [];
  listSelectedPrices: Partial<IPriceDetail>[] = [];

  customers$: Observable<ICustomer[]>;
  columns = [
    { key: 'colNo', display: 'No' },
    { key: 'VihicleCategoryName', display: 'Vehicle_Category' },
    { key: 'Price', display: 'Price' },
    { key: 'Notes', display: 'Notes' }
  ];

  existType: boolean;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private priceService: PriceService,
    private timeService: TimeService,
    private vehicleCategoryService: VehicleCategoryService,
    private priceDetailService: PriceDetailService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getVehiclesCategories(environment.parkingId);
    this.customers$ = this.customerService.getCustomerByParking(environment.parkingId);

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getPriceById(this.id);
      }
    });
  }

  getVehiclesCategories(parkingId: number): void {
    this.vehicleCategories$ = this.vehicleCategoryService.getVehicleCategoriesByParking(parkingId);
  }

  initForm(): void {
    this.priceForm = this.fb.group({
      Id: [0],
      eParkingId: [environment.parkingId],
      CustomerId: [null, Validators.required],
      ContractsNumber: [''],
      ValidFromDate: [null, Validators.required],
      ValidToDate: [null, Validators.required],
      IsActived: [true],
      IsActivedName: [''],
      ActiveTime: ['']
    });

    this.priceDetailForm = this.fb.group({
      VihicleCategoryId: [null],
      Type: [null, [Validators.required, this.checkExistType()]],
      Price: [0, Validators.required],
      Notes: ['']
    });
  }

  back(): void {
    this.router.navigateByUrl('master-data/prices');
  }

  getPriceById(priceId: number): void {
    this.priceService.getPriceById(priceId).subscribe((price) => {
      this.priceForm.patchValue({
        Id: price.Id,
        eParkingId: price.eParkingId,
        CustomerId: price.CustomerId,
        ContractsNumber: price.ContractsNumber,
        ValidFromDate: price.ValidFromDate ? this.timeService.convertToDateTime(price.ValidFromDate) : null,
        ValidToDate: price.ValidToDate ? this.timeService.convertToDateTime(price.ValidToDate) : null,
        IsActived: price.IsActived,
        IsActivedName: price.IsActived ? YesNo.YES : YesNo.NO,
        ActiveTime: price.ActiveTime
      });

      this.listPrices = price.ItemDetailed.map((detail) => {
        detail.canEdit = false;
        detail.canView = false;
        return detail;
      });
    });
  }

  save(): void {
    if (this.priceForm.valid) {
      switch (this.crudType) {
        case CrudType.CREATE:
          this.create();
          break;
        case CrudType.EDIT:
          this.update();
          break;
        default:
          break;
      }
    } else {
      this.priceForm.markAllAsTouched();
    }
  }

  create(): void {
    if (this.priceForm.valid) {
      const { Id, CustomerId, ContractsNumber, ValidFromDate, ValidToDate, IsActived } = this.priceForm.value;

      const reqData = {
        Id,
        EParkingId: environment.parkingId,
        CustomerId,
        ContractsNumber,
        ValidFromDate: ValidFromDate ? format(ValidFromDate, 'yyyyMMdd') : null,
        ValidToDate: ValidToDate ? format(ValidToDate, 'yyyyMMdd') : null,
        IsActived,
        ItemDetailed: this.listPrices
      };

      this.priceService.addPrice(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Created successfully.', 'Price');
          this.back();
        }
      });
    }
  }

  update(): void {
    if (this.priceForm.valid) {
      const { Id, ContractsNumber, ValidFromDate, ValidToDate, IsActived } = this.priceForm.value;
      const reqData = {
        Id: this.id,
        ContractsNumber,
        IsActived,
        ValidFromDate: ValidFromDate ? format(ValidFromDate, 'yyyyMMdd') : null,
        ValidToDate: ValidToDate ? format(ValidToDate, 'yyyyMMdd') : null
      };

      this.priceService.updatePrice(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Updated successfully.', 'Price');
          this.back();
        }
      });
    }
  }

  addPrice(): void {
    if (this.priceDetailForm.valid) {
      this.existType = false;
      const { Price, Type }: { Price: number; Type: IVehicleCategory } = this.priceDetailForm.value;

      const inputData: Partial<IPriceDetail> = {
        PriceId: this.id,
        VihicleCategoryName: Type.Name,
        VihicleCategoryId: Type.Id,
        Price,
        Notes: ''
      };

      switch (this.crudType) {
        case CrudType.CREATE:
          this.listPrices.push(inputData);
          break;
        case CrudType.EDIT:
          this.priceDetailService.addPriceDetail(inputData).subscribe((res) => {
            if (res.Code === '100') {
              this.priceDetailForm.reset();
              inputData.canEdit = false;
              inputData.canView = false;
              this.listPrices.push(inputData);
              this.listPrices = [...this.listPrices];
            }
          });
          break;
        default:
          break;
      }
    } else {
      this.priceDetailForm.markAllAsTouched();
    }
  }

  deletePrice(price: IPriceDetail): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Bạn có muốn xóa chi tiết giá này?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.priceDetailService.deletePriceDetail(price.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Price');
            this.listPrices = this.listPrices.filter((value) => value.Id !== price.Id);
            this.listPrices = [...this.listPrices];
          }
        });
      }
    });
  }

  checkExistType(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const existType = this.listPrices.find((price) => price.VihicleCategoryId === control.value?.Id);
      return existType ? { isExistType: true } : null;
    };
  }
}
