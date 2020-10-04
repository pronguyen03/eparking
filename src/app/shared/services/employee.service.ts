import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../classes/employee';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  routeUrl = 'Employees';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getEmployeesByCustomer(customerId: number): Observable<Employee[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyCustomer`, {
        Item: {
          CustomerId: customerId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  addEmployee(inputData: Partial<Employee>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
    });
  }

  updateEmployee(inputData: Partial<Employee>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }

  deleteEmployee(employeeId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: employeeId,
      },
    });
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: employeeId,
        },
      })
      .pipe(map((res) => res.Data));
  }
}
