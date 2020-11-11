import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounce, debounceTime, map, switchMap, switchMapTo } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { IUser } from '../interfaces/user';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  routeUrl = 'Users';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getAll(): Observable<IUser[]> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyAll`, {
        Item: {},
      })
      .pipe(map((response) => response.Data));
  }

  deleteUser(userId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Delete`, {
      Item: {
        Id: userId
      }
    });
  }

  getUserById(userId: number): Observable<IUser> {
    return this.http
      .post<ApiResponse>(`${this.url}/GetbyId`, {
        Item: {
          Id: userId,
        },
      })
      .pipe(map((res) => res.Data));
  }

  addUser(inputData: Partial<IUser>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Add`, {
      Item: inputData,
    });
  }

  updateUser(inputData: Partial<IUser>): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Update`, {
      Item: inputData,
    });
  }

  validateExistUsername(customerId: number, username: string): Observable<boolean> {
    return of({
      Item: {
        CustomerId: customerId,
        UserName: username
      },
      isValidatorRequest: true
    }).pipe(
      debounceTime(500),
      switchMap(body => this.http.post<ApiResponse>(`${this.url}/CheckUserName`, body))
    ).pipe(
      map(res => res.Data as boolean),
    );
  }

  changePassword(userId: number, oldPassword: string,  newPassword: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/ChangePsw`, {
      Item: {
        Id: userId,
        Password: newPassword
      },
      OldPassword: oldPassword
    });
  }

  resetPassword(userId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/ResetPass`, {
      Item: {
        Id: userId
      }
    });
  }

  login(requestData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/Login`, requestData);
  }
}
