import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAccessVehicle } from '../interfaces/access-vehicle';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class AccessVehicleService {
  routeUrl = 'RequestEntryDetaileds';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getAccessVehiclesByRequestId(RepuestEntryId: number): Observable<IAccessVehicle[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          RepuestEntryId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  deleteAccessVehicle(accessVehiclesId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: accessVehiclesId,
      },
    });
  }

  addAccessVehicle(inputData: Partial<IAccessVehicle>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData
    });
  }

  updateAccessVehicle(inputData: Partial<IAccessVehicle>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }
}
