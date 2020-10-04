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

  getVehicleById(vehicleId: number): Observable<Vehicle> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: vehicleId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  addVehicle(inputData: Partial<Vehicle>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
    });
  }

  updateVehicle(inputData: Partial<Vehicle>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }

  deleteVehicle(vehicleId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: vehicleId,
      },
    });
  }

  setApproving(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/SetApproving`, {
      Item: {
        Id: id,
      },
    });
  }

  setApproved(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/SetApproving`, {
      Item: {
        Id: id,
      },
    });
  }

  cancelApprove(id: number, note?: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/CancelApprove`, {
      Item: {
        Id: id,
        Notes: note,
      },
    });
  }
}
