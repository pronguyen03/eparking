import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAccessVehicle } from '../interfaces/access-vehicle';
import { ApiResponse } from '../interfaces/api-response';
import { IRequestEntry } from '../interfaces/request-entry';
import { IVehicle } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root'
})
export class RequestEntryService {
  routeUrl = 'RequestEntries';
  url: string;

  filterSubject = new BehaviorSubject<{ [key: string]: any }>({});

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
          CustomerId: customerId
        },
        FromDate: fromDate,
        ToDate: toDate,
        Type: vehicleType
      })
      .pipe(map((res) => res.Data));
  }

  getRequestsByParking(
    parkingId: number,
    fromDate: string,
    toDate: string,
    vehicleType?: number
  ): Observable<IRequestEntry[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyParking`, {
        Item: {
          EParkingId: parkingId
        },
        FromDate: fromDate,
        ToDate: toDate,
        Type: vehicleType
      })
      .pipe(map((res) => res.Data));
  }

  getRequestEntryById(requestId: number): Observable<{ Item: IRequestEntry; ItemDetaileds: IAccessVehicle[] }> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: +requestId
        }
      })
      .pipe(map((res) => res.Data));
  }

  addRequestEntry(inputData: Partial<IRequestEntry>, ItemDetaileds: Partial<IVehicle>[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
      ItemDetaileds
    });
  }

  updateRequestEntry(inputData: Partial<IRequestEntry>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData
    });
  }

  deleteRequestEntry(requestId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: requestId
      }
    });
  }

  getFilterValue(): Observable<{ [key: string]: any }> {
    return this.filterSubject.asObservable();
  }

  setDone(requestId: number, NoteDone: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/SetDone`, {
      Item: {
        Id: requestId,
        NoteDone
      }
    });
  }
}
