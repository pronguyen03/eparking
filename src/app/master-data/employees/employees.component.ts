import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Employee } from '@app/shared/classes/employee';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { EmployeeService } from '@app/shared/services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];

  columns = [
    { key: 'EmployeeName', display: 'Employee_Name' },
    { key: 'Tel', display: 'Tel_No' },
    { key: 'EmployeePassport', display: 'Employee_Passport' },
    { key: 'CustomerName', display: 'Customer_Name' }
  ];

  constructor(
    private authService: AuthenticationService,
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getEmployeesByCustomer(this.authService.currentUserValue.CustomerId);
  }

  getEmployeesByCustomer(customerId: number): void {
    this.employeeService.getEmployeesByCustomer(customerId).subscribe((employees) => {
      this.employees = employees;
    });
  }

  addNew(): void {
    this.router.navigate(['master-data/employees/detail', CrudType.CREATE]);
  }

  viewDetail(employee: Employee): void {
    this.router.navigate(['master-data/employees/detail', CrudType.VIEW, employee.Id]);
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['master-data/employees/detail', CrudType.EDIT, employee.Id]);
  }

  deleteEmployee(employee: Employee): void {
    const dialogData = new ConfirmDialogModel('Delete Confirm', 'Are you sure you want to delete this employee?');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.employeeService.deleteEmployee(employee.Id).subscribe((res) => {
          if (res.Code === '100') {
            this.toastr.success('Deleted successfully.', 'Employee');
            this.employees = this.employees.filter((value) => value.Id !== employee.Id);
          }
        });
      }
    });
  }
}
