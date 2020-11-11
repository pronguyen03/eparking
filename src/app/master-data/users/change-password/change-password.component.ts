import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { UserService } from '@app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private userService: UserService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: this.validateConfirmPassword()
    }
    );
  }

  onSave(): void {
    // Close the dialog, return true
    const encodedOldPassword = this.authService.encodePassword(this.passwordForm.value.oldPassword);
    const encodedPassword = this.authService.encodePassword(this.passwordForm.value.newPassword);
    this.userService.changePassword(this.authService.currentUserValue.Id, encodedOldPassword, encodedPassword).subscribe(res => {
      if (res.Code === '100') {
        this.toastr.success('Changed password successfully.', 'User');
        this.dialogRef.close(true);
      }
    });
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  validateConfirmPassword(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const newPassword = group.controls.newPassword;
      const confirmPassword = group.controls.confirmPassword;

      if (newPassword.value && confirmPassword.value) {
        if (newPassword.value !== confirmPassword.value) {
          const errors = confirmPassword.errors;
          if (errors) {
            errors.passwordNotMatch = true;
            confirmPassword.setErrors(errors);
          } else {
            confirmPassword.setErrors({ passwordNotMatch: true });
          }
        } else {
          const errors = confirmPassword.errors;
          if (errors) {
            delete errors.passwordNotMatch;
            if (Object.keys(errors).length > 0) {
              confirmPassword.setErrors(errors);
            } else {
              confirmPassword.setErrors(null);
            }
          } else {
            confirmPassword.setErrors(null);
          }
        }
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors.passwordNotMatch;
          if (Object.keys(errors).length > 0) {
            confirmPassword.setErrors(errors);
          } else {
            confirmPassword.setErrors(null);
          }
        } else {
          confirmPassword.setErrors(null);
        }
      }

      return null;
    };
  }
}
