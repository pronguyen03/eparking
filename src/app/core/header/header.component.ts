import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '@app/master-data/users/change-password/change-password.component';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: MatSidenav;
  fullName: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.fullName = this.authenticationService.currentUserValue.FullName;
  }

  ngOnInit(): void { }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  changePassword(): void {
    this.dialog.open(ChangePasswordComponent, {
      minWidth: '600px',
    });
  }
}
