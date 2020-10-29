import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-price-detail',
  templateUrl: './price-detail.component.html',
  styleUrls: ['./price-detail.component.scss']
})
export class PriceDetailComponent implements OnInit {
  CrudType = CrudType;
  priceForm: FormGroup;
  crudType: CrudType;
  id: number;

  customers$: Observable<ICustomer[]>;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private priceService: PriceService,
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.customers$ = this.customerService.getCustomerByParking(environment.parkingId);

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getPriceById(this.id);
      }
    });
  }

  initForm(): void {
    this.priceForm = this.fb.group({
      Id: [0],
      eParkingId: [environment.parkingId],
      CustomerId: [0],
      ContractsNumber: [''],
      ValidFromDate: [null],
      ValidToDate: [null],
      IsActived: [true],
      IsActivedName: [''],
      ActiveTime: ['']
    });
  }

  back(): void {
    this.router.navigateByUrl('master-data/prices');
  }

  getPriceById(priceId: number): void {
    this.priceService.getPriceById(priceId).subscribe(price => {
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
    });
  }

  save(): void {
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
  }

  create(): void {
    if (this.priceForm.valid) {
      const {
        Id,
        CustomerId,
        ContractsNumber,
        ValidFromDate,
        ValidToDate,
        IsActived
       } = this.priceForm.value;

      const reqData = {
        Id,
        EParkingId: environment.parkingId,
        CustomerId,
        ContractsNumber,
        ValidFromDate: format(ValidFromDate, 'yyyyMMdd'),
        ValidToDate: format(ValidToDate, 'yyyyMMdd'),
        IsActived
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
      const {
        Id,
        ContractsNumber,
        ValidFromDate,
        ValidToDate
       } = this.priceForm.value;
      const reqData = {
        Id: this.id,
        ContractsNumber,
        ValidFromDate: format(ValidFromDate, 'yyyyMMdd'),
        ValidToDate: format(ValidToDate, 'yyyyMMdd'),
      };

      this.priceService.updatePrice(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Updated successfully.', 'Price');
          this.back();
        }
      });
    }
  }

}
