import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem } from '../classes/menu-item';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  routeUrl = 'Menus';
  private menuSubject: BehaviorSubject<MenuItem[]>;
  public listMenu: Observable<MenuItem[]>;

  constructor(private http: HttpClient) {
    this.menuSubject = new BehaviorSubject<MenuItem[]>([]);
    this.listMenu = this.menuSubject.asObservable();
  }

  getMenusByRoleId(roleId: number, parentId: number): Observable<MenuItem[]> {
    return this.http
      .post<ApiResponse>(`${environment.apiUrl}/${this.routeUrl}/GetbyRoleId`, {
        RoleId: roleId,
        ParentId: parentId,
      })
      .pipe(map((res) => res.Data as MenuItem[]));
  }
}
