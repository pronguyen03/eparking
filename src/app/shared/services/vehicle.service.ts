import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from '../classes/vehicle';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  routeUrl = 'Vihicles';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getVehiclesByCustomer(customerId: number): Observable<Vehicle[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyCustomer`, {
        Item: {
          CustomerId: customerId,
        },
      })
      .pipe(map((res) => res.Data));
  }
}
