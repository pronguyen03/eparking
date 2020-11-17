import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IVehicle } from '../interfaces/vehicle';
import { ApiResponse } from '../interfaces/api-response';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import { VehicleStatus } from '../enums/vehicle-status.enum';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  routeUrl = 'Vihicles';
  url: string;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getVehiclesByCustomer(customerId: number): Observable<IVehicle[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyCustomer`, {
        Item: {
          CustomerId: customerId
        }
      })
      .pipe(map((res) => res.Data));
  }

  getVehiclesByParking(parkingId: number, status: VehicleStatus = -1): Observable<IVehicle[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyParking`, {
        Item: {
          eParkingId: parkingId,
          Status: status
        }
      })
      .pipe(map((res) => res.Data));
  }

  getVehicleById(vehicleId: number): Observable<IVehicle> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: vehicleId
        }
      })
      .pipe(map((res) => res.Data));
  }

  addVehicle(inputData: Partial<IVehicle>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData
    });
  }

  updateVehicle(inputData: Partial<IVehicle>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData
    });
  }

  deleteVehicle(vehicleId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: vehicleId
      }
    });
  }

  setApproving(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/SetApproving`, {
      Item: {
        Id: id
      }
    });
  }

  setApproved(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/SetApproved`, {
      Item: {
        Id: id
      }
    });
  }

  cancelApprove(id: number, note?: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/CancelApprove`, {
      Item: {
        Id: id,
        Notes: note
      }
    });
  }

  uploadImage(formData: FormData): any {
    const currentUser = this.authenticationService.currentUserValue;
    return this.http.post<ApiResponse>(
      `${this.url}/UploadFiles?token=${encodeURIComponent(currentUser.TokenKey)}`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }
}
