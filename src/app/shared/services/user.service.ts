import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
}
