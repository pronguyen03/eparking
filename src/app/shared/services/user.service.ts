import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  routeUrl = 'Users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http
      .post<ApiResponse>(`${environment.apiUrl}/${this.routeUrl}/GetbyAll`, {
        Item: {},
      })
      .pipe(map((response) => response.Data));
  }
}
