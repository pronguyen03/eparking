import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IAccessVehicle } from '../interfaces/access-vehicle';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class RequestEntryDetailService {
  routeUrl = 'RequestEntryDetaileds';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  addRequestEntryDetail(inputData: Partial<IAccessVehicle>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: {
        RepuestEntryId: inputData.RequestEntryId,
        Plate: inputData.Plate,
        TypeId: inputData.TypeId
      }
    });
  }

  // updateRequestEntry(inputData: Partial<IRequestEntry>): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(`${this.url}/Update`, {
  //     Item: inputData,
  //   });
  // }

  deleteRequestEntryDetail(requestDetailId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: requestDetailId
      }
    });
  }
}
