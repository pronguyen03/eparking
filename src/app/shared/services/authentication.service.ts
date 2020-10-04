import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public isAuthenticated: boolean;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return of({
      EParkingId: 1,
      CustomerId: 5,
      Id: 2,
      Username: 'cuongnv',
      PassWord: '1234',
      FullName: 'Nfdsfdsfdsfdsdng',
      Sex: true,
      Dob: null,
      Mobile: '',
      Email: '',
      Address: 'Hà Nội',
      Zalo: '',
      Skype: '',
      Facebook: '',
      AccountNumber: '',
      Bank: '',
      RoleId: 2,
      Image: 'fdsfadsfdsadsaafdas',
      Actived: true,
      TokenKey: '1234567890',
    }).pipe(
      map((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
    // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
    //   .pipe(
    //     map((user) => {
    //       localStorage.setItem('currentUser', JSON.stringify(user));
    //       this.currentUserSubject.next(user);
    //       return user;
    //     })
    //   );
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
