import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { IRequestEntry } from '../interfaces/request-entry';

@Injectable({
  providedIn: 'root',
})
export class RequestEntryService {
  routeUrl = 'RequestEntries';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getRequestsByCustomer(
    customerId: number,
    fromDate: string,
    toDate: string,
    vehicleType?: number
  ): Observable<IRequestEntry[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyCustomer`, {
        Item: {
          CustomerId: customerId,
        },
        FromDate: fromDate,
        ToDate: toDate,
        Type: vehicleType,
      })
      .pipe(map((res) => res.Data));
  }

  getRequestEntryById(requestId: number): Observable<IRequestEntry> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: requestId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  addRequestEntry(inputData: Partial<IRequestEntry>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
    });
  }

  updateRequestEntry(inputData: Partial<IRequestEntry>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }

  deleteRequestEntry(requestId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: requestId,
      },
    });
  }
}
