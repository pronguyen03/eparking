import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@app/shared/interfaces/api-response';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;
  hidePassword = true;
  accessToken: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // Check Access Token
    this.route.queryParams.subscribe((queryParams) => {
      this.accessToken = queryParams.AccessToken;
      if (this.accessToken) {
        this.checkAccessToken(this.accessToken);
      } else {
        this.redirectToExternalLink();
      }
    });

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      saveProfileFlag: [false]
    });

    if (localStorage.getItem('loginInfo')) {
      const loginInfo: { username: string; password: string } = JSON.parse(localStorage.getItem('loginInfo'));
      if (loginInfo) {
        this.loginForm.patchValue({
          username: loginInfo.username,
          password: loginInfo.password,
          saveProfileFlag: true
        });
      }
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authenticationService
      .login(this.loginForm.value.username, this.loginForm.value.password, this.loginForm.value.saveProfileFlag)
      .subscribe(
        () => {
          this.lockAccessToken(this.accessToken).pipe(take(1)).subscribe();
          const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
          this.router.navigate([returnUrl]);
        },
        (error) => {
          this.error = error;
        }
      );
  }

  checkAccessToken(accessToken: string): void {
    this.authenticationService.checkAccessToken(accessToken).subscribe((res) => {
      if (!res) {
        this.redirectToExternalLink();
      }
    });
  }

  lockAccessToken(accessToken: string): Observable<ApiResponse> {
    return this.authenticationService.lockAccessToken(accessToken);
  }

  redirectToExternalLink(): void {
    window.location.href = 'http://delta.com.vn/';
  }
}
