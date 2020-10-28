import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { CustomerService } from '@app/shared/services/customer.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  CrudType = CrudType;
  customerForm: FormGroup;
  crudType: CrudType;
  id: number;


  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getCustomerById(this.id);
      }
    });
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      CustomerId: [0],
      eParkingId: [0],
      CustomerName: [''],
      Address: [''],
      ContactName: [''],
      Mobile: [''],
      Tel: [''],
      Fax: [''],
      Email: [''],
      TaxCode: [''],
      Account: [''],
      Bank: [''],
      CreateTime: [''],
      Disable: [false],
      DisableName: [''],
      LastUpdate: [''],
    });
  }

  back(): void {
    this.router.navigateByUrl('master-data/customers');
  }

  getCustomerById(customerId: number): void {
    this.customerService.getCustomerById(customerId).subscribe(customer => {
      this.customerForm.patchValue({
        CustomerId: customer.CustomerId,
        eParkingId: customer.eParkingId,
        CustomerName: customer.CustomerName,
        Address: customer.Address,
        ContactName: customer.ContactName,
        Mobile: customer.Mobile,
        Tel: customer.Tel,
        Fax: customer.Fax,
        Email: customer.Email,
        TaxCode: customer.TaxCode,
        Account: customer.Account,
        Bank: customer.Bank,
        CreateTime: customer.CreateTime,
        Disable: customer.Disable,
        DisableName: customer.Disable ? 'YES' : 'NO',
        LastUpdate: customer.LastUpdate,
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
    if (this.customerForm.valid) {
      const {
          eParkingId,
          CustomerName,
          Address,
          ContactName,
          Mobile,
          Tel,
          Fax,
          Email,
          TaxCode,
          Account,
          Bank,
          Disable
       } = this.customerForm.value;
      const reqData = {
        eParkingId: environment.parkingId,
        CustomerName,
        Address,
        ContactName,
        Mobile,
        Tel,
        Fax,
        Email,
        TaxCode,
        Account,
        Bank,
        Disable
      };

      this.customerService.addCustomer(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Created successfully.', 'Customer');
          this.back();
        }
      });
    }
  }


  update(): void {
    if (this.customerForm.valid) {
      const {
        CustomerId,
        CustomerName,
        Address,
        ContactName,
        Mobile,
        Tel,
        Fax,
        Email,
        TaxCode,
        Account,
        Bank,
        Disable,
       } = this.customerForm.value;
      const reqData = {
        CustomerId,
        CustomerName,
        Address,
        ContactName,
        Mobile,
        Tel,
        Fax,
        Email,
        TaxCode,
        Account,
        Bank,
        Disable,
      };

      this.customerService.updateCustomer(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Updated successfully.', 'Customer');
          this.back();
        }
      });
    }
  }
}
