import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { IPriceDetail } from '../interfaces/price-detail';

@Injectable({
  providedIn: 'root'
})
export class PriceDetailService {
  routeUrl = 'PriceDetaileds';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getPriceDetailById(priceId: number): Observable<IPriceDetail[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          PriceId: priceId
        }
      })
      .pipe(map((res) => res.Data));
  }

  deletePriceDetail(priceDetailId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: priceDetailId
      }
    });
  }

  addPriceDetail(inputData: Partial<IPriceDetail>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData
    });
  }

  updatePriceDetail(inputData: Partial<IPriceDetail>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData
    });
  }
}
