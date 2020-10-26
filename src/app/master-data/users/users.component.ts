import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { IUser } from '@app/shared/interfaces/user';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { UserService } from '@app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  columns: ITableCol[] = [
    { key: 'Username', display: 'Username' },
    { key: 'FullName', display: 'FullName' },
    { key: 'Address', display: 'Address' },
    { key: 'Actived', display: 'Actived', type: 'boolean' },
    { key: 'RoleName', display: 'Role'}
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
  }

  addNew(): void {
    this.router.navigate(['master-data/users/detail', CrudType.CREATE]);
  }

  viewDetail(user: IUser): void {
    this.router.navigate(['master-data/users/detail', CrudType.VIEW, user.Id]);
  }

  editUser(user: IUser): void {
    this.router.navigate(['master-data/users/detail', CrudType.EDIT, user.Id]);
  }

  deleteUser(user: IUser): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this user?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.userService.deleteUser(user.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Vehicle');
            this.users = this.users.filter((value) => user.Id !== value.Id);
          }
        });
      }
    });
  }

}
