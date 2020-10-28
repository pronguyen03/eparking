import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  UserId: number;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private userService: UserService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
    this.UserId = data;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  onSave(): void {
    // Close the dialog, return true
    const encodedPassword = this.authService.encodePassword(this.passwordForm.value.password);
    this.userService.changePassword(this.UserId, encodedPassword).subscribe(res => {
      if (res.Code === '100') {
        this.toastr.success('Changed password successfully.', 'User');
        this.dialogRef.close(true);
      } else {
        this.toastr.error(res.Message, 'User');
      }
    });
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
