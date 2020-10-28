import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { IRole } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  routeUrl = 'Roles';
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/${this.routeUrl}`;
  }

  getAll(): Observable<IRole[]> {
    return this.http
    .post<ApiResponse>(`${this.url}/Get`, {
      Item: {},
    })
    .pipe(map((res) => res.Data));
  }
}
