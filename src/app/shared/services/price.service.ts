import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { IPrice } from '../interfaces/price';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  routeUrl = 'Prices';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getPricesByParking(parkingId: number): Observable<IPrice[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyEparking`, {
        Item: {
          EParkingId: parkingId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  deletePrice(priceId: number): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.url}/Delete`, {
        Item: {
          Id: priceId,
        },
      });
  }

  getPriceById(priceId: number): Observable<IPrice> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: priceId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  addPrice(inputData: Partial<IPrice>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
    });
  }

  updatePrice(inputData: Partial<IPrice>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }
}
