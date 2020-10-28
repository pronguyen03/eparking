import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { ICustomer } from '../interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  routeUrl = 'Customers';
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getCustomerByParking(parkingId: number): Observable<ICustomer[]> {
    return this.http.post<ApiResponse>(`${this.url}/GetbyParking`, {
      Item: {
        eParkingId: parkingId
      }
    }).pipe(map(res => res.Data));
  }

  deleteCustomer(customerId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        CustomerId: customerId
      }
    });
  }

  getCustomerById(customerId: number): Observable<ICustomer> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          CustomerId: customerId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  addCustomer(inputData: Partial<ICustomer>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
    });
  }

  updateCustomer(inputData: Partial<ICustomer>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }
}
