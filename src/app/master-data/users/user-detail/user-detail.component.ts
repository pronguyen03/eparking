import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { UserService } from '@app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  CrudType = CrudType;
  customerForm: FormGroup;
  crudType: CrudType;
  id: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getUserById(this.id);
      }
    });
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      EParkingId: [0],
      CustomerId: [0],
      Id: [0],
      Username: [''],
      PassWord: [''],
      FullName: [''],
      Sex: [false],
      Dob: [''],
      Mobile: [''],
      Email: [''],
      Address: [''],
      Zalo: [''],
      Skype: [''],
      Facebook: [''],
      AccountNumber: [''],
      Bank: [''],
      RoleId: 1,
      Image: [''],
      Actived: [true]
    });
  }

  back(): void {
    this.router.navigateByUrl('master-data/users');
  }

  getUserById(userId: number): void {
    this.userService.getUserById(userId).subscribe(user => {
      this.customerForm.patchValue({
        CustomerId: user.CustomerId,
        eParkingId: user.eParkingId,
        CustomerName: user.CustomerName,
        Address: user.Address,
        ContactName: user.ContactName,
        Mobile: user.Mobile,
        Tel: user.Tel,
        Fax: user.Fax,
        Email: user.Email,
        TaxCode: user.TaxCode,
        Account: user.Account,
        Bank: user.Bank,
        CreateTime: user.CreateTime,
        Disable: user.Disable,
        DisableName: user.Disable ? 'YES' : 'NO',
        LastUpdate: user.LastUpdate,
      });
    });
  }

}
