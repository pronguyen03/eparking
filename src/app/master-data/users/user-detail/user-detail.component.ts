import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, ValidationErrors, AsyncValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { Role } from '@app/shared/enums/role.enum';
import { YesNo } from '@app/shared/enums/yes-no.enum';
import { ICustomer } from '@app/shared/interfaces/customer';
import { IRole } from '@app/shared/interfaces/role';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { CustomerService } from '@app/shared/services/customer.service';
import { RoleService } from '@app/shared/services/role.service';
import { UserService } from '@app/shared/services/user.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  CrudType = CrudType;
  userForm: FormGroup;
  crudType: CrudType;
  id: number;

  roles$: Observable<IRole[]>;
  customers$: Observable<ICustomer[]>;

  Role = Role;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private customerService: CustomerService,
    private authService: AuthenticationService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initForm();

    this.roles$ = this.roleService.getAll();
    this.customers$ = this.customerService.getCustomerByParking(environment.parkingId);


    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      this.updateValidators();
      if (this.id) {
        this.getUserById(this.id);
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      EParkingId: [environment.parkingId],
      CustomerId: [null],
      Id: [0],
      Username: ['', [Validators.required]],
      PassWord: [''],
      FullName: ['', [Validators.required]],
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
      RoleId: [null, [Validators.required]],
      Image: [''],
      Actived: [true],
      ActivedName: ['']
    });
  }

  updateValidators(): void {
    switch (this.crudType) {
      case CrudType.CREATE:
        this.userForm.controls.PassWord.setValidators(Validators.required);
        this.userForm.controls.PassWord.updateValueAndValidity();
        this.userForm.setAsyncValidators([this.checkExistUsernameValidator()]);
        this.userForm.updateValueAndValidity();
        break;
      case CrudType.EDIT:
        this.userForm.controls.PassWord.clearValidators();
        this.userForm.controls.PassWord.updateValueAndValidity();
        this.userForm.clearAsyncValidators();
        this.userForm.updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  back(): void {
    this.router.navigateByUrl('master-data/users');
  }

  getUserById(userId: number): void {
    this.userService.getUserById(userId).subscribe(user => {
      this.userForm.patchValue({
        EParkingId: user.EParkingId,
        CustomerId: user.CustomerId,
        Id: user.Id,
        Username: user.Username,
        FullName: user.FullName,
        Sex: user.Sex,
        Dob: user.Dob,
        Mobile: user.Mobile,
        Email: user.Email,
        Address: user.Address,
        Zalo: user.Zalo,
        Skype: user.Skype,
        Facebook: user.Facebook,
        AccountNumber: user.AccountNumber,
        Bank: user.Bank,
        RoleId: user.RoleId,
        Image: user.Image,
        Actived: user.Actived,
        ActivedName: user.Actived ? YesNo.YES : YesNo.NO
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
    if (this.userForm.valid) {
      const {
        eParkingId,
        CustomerId,
        Username,
        PassWord,
        FullName,
        Sex,
        Dob,
        Mobile,
        Email,
        Address,
        Zalo,
        Skype,
        Facebook,
        AccountNumber,
        Bank,
        RoleId,
        Image,
        Actived
       } = this.userForm.value;

      const encodedPassword = this.authService.encodePassword(PassWord);
      const reqData = {
        eParkingId: environment.parkingId,
        CustomerId,
        Username,
        PassWord: encodedPassword,
        FullName,
        Sex,
        Dob,
        Mobile,
        Email,
        Address,
        Zalo,
        Skype,
        Facebook,
        AccountNumber,
        Bank,
        RoleId,
        Image,
        Actived
      };

      this.userService.addUser(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Created successfully.', 'User');
          this.back();
        }
      });
    }
  }


  update(): void {
    if (this.userForm.valid) {
      const {
        Id,
        Username,
        FullName,
        Sex,
        Dob,
        Mobile,
        Email,
        Address,
        Zalo,
        Skype,
        Facebook,
        AccountNumber,
        Bank,
        RoleId,
        Image,
        Actived
       } = this.userForm.value;
      const reqData = {
        Id,
        Username,
        FullName,
        Sex,
        Dob,
        Mobile,
        Email,
        Address,
        Zalo,
        Skype,
        Facebook,
        AccountNumber,
        Bank,
        RoleId,
        Image,
        Actived
      };

      this.userService.updateUser(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Updated successfully.', 'User');
          this.back();
        }
      });
    }
  }

  checkExistUsernameValidator(): AsyncValidatorFn {
      return (group: FormGroup) => {
        const CustomerId = group.controls.CustomerId;
        const Username = group.controls.Username;
        if (!CustomerId.value || !Username.value) {
          return of(null);
        }
        return this.userService.validateExistUsername(CustomerId.value, Username.value).pipe(map(res => {
          let listError = Username.errors;
          if (listError) {
            listError.existUsername = true;
          } else {
            listError = {
              existUsername: true
            };
          }
          return res ? Username.setErrors(listError) : null;
        }));
      };
  }

  changePassword(): void {
    this.dialog.open(ChangePasswordComponent, {
      minWidth: '600px',
      data: this.id,
    });
  }

  resetPassword(): void {
    const dialogData = new ConfirmDialogModel('Reset Confirm', 'Are you sure you want to reset password?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.userService.resetPassword(this.id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Reset successfully.', 'User');
          }
        });
      }
    });
  }

}
