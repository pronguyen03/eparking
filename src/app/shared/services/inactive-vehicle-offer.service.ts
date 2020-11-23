import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { IInactiveVehicleOffer } from '../interfaces/inactive-vehicle-offer';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InactiveVehicleOfferService {
  routeUrl = 'InActiverVihicleOffers';
  url: string;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getInactiveVehicleOffersByParking(parkingId: number): Observable<IInactiveVehicleOffer[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyParking`, {
        Item: {
          EParkingId: parkingId
        }
      })
      .pipe(map((res) => res.Data));
  }

  getOfferById(offerId: number): Observable<IInactiveVehicleOffer> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: offerId
        }
      })
      .pipe(map((res) => res.Data));
  }

  updateOffer(inputData: Partial<IInactiveVehicleOffer>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData
    });
  }

  addOffer(inputData: Partial<IInactiveVehicleOffer>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData
    });
  }

  deleteOffer(offerId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: offerId
      }
    });
  }

  getInactiveVehicleOffersByCustomer(customerId: number): Observable<IInactiveVehicleOffer[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyCustomer`, {
        Item: {
          CustomerId: customerId
        }
      })
      .pipe(map((res) => res.Data));
  }

  setApproving(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/SetApproving`, {
      Item: {
        Id: id
      }
    });
  }

  setApproved(id: number, approverId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Approved`, {
      Item: {
        Id: id,
        WhoApproved: approverId
      }
    });
  }
}
