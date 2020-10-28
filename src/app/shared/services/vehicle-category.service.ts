import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { IVehicleCategory } from '../interfaces/vehicle-category';

@Injectable({
  providedIn: 'root',
})
export class VehicleCategoryService {
  routeUrl = 'VihicleCategory';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getVehicleCategoriesByParking(parkingId: number): Observable<IVehicleCategory[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyParking`, {
        Item: {
          Id: parkingId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  addVehicleCategory(inputData: Partial<IVehicleCategory>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
    });
  }

  deleteCategory(categoryId: number): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: categoryId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  getVehicleCategoryById(categoryId: number): Observable<IVehicleCategory> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: categoryId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  updateVehicleCategory(inputData: Partial<IVehicleCategory>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }
}
