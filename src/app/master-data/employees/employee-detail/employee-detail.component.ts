import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { EmployeeService } from '@app/shared/services/employee.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  CrudType = CrudType;
  employeeForm: FormGroup;
  crudType: CrudType;
  id: number;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getEmployeeById(this.id);
      }
    });
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      CustomerName: [''],
      EmployeeName: [''],
      Tel: [''],
      EmployeePassport: [''],
    });
  }

  back(): void {
    this.router.navigateByUrl('master-data/employees');
  }

  getEmployeeById(employeeId: number): void {
    this.employeeService.getEmployeeById(employeeId).subscribe((employee) => {
      this.employeeForm.patchValue({
        CustomerName: employee.CustomerName,
        EmployeeName: employee.EmployeeName,
        Tel: employee.Tel,
        EmployeePassport: employee.EmployeePassport,
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
    if (this.employeeForm.valid) {
      const { EmployeeName, Tel, EmployeePassport } = this.employeeForm.value;
      const reqData = {
        EParkingId: environment.parkingId,
        CustomerId: this.authService.currentUserValue.CustomerId,
        EmployeeName,
        Tel,
        EmployeePassport,
      };

      this.employeeService.addEmployee(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Created Employee successfully.', 'Employee');
          this.back();
        }
      });
    }
  }

  update(): void {
    if (this.employeeForm.valid) {
      const { EmployeeName, Tel, EmployeePassport } = this.employeeForm.value;
      const reqData = {
        Id: this.id,
        EmployeeName,
        Tel,
        EmployeePassport,
      };

      this.employeeService.updateEmployee(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Updated successfully.', 'Employee');
          this.back();
        }
      });
    }
  }
}
