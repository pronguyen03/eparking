import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { encode, decode } from 'js-base64';
import { UserService } from './user.service';
import { ApiResponse } from '../interfaces/api-response';
import { IUser } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;
  public isAuthenticated: boolean;

  constructor(private http: HttpClient, private userService: UserService) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    const ItemLogs = {
      IP: '' ,
      Browser: '' ,
      OS: ''
    };
    ItemLogs.Browser = this.getBrowserName();
    ItemLogs.OS = this.getOS();
    const requestData = {
      Username: username ,
      PassWord: this.encodePassword(password),
      ItemLogs
    };
    return this.userService.login(requestData).pipe(
      concatMap((res: ApiResponse) => {
        if (res.Code !== '102') {
          const data = res.Data;
          const user: any = {};
          user.TokenKey = data.TokenKey;
          user.ExpriedTime = data.ExpriedTime;
          user.Id = data.UserId;
          this.currentUserSubject.next(user);
          const user$ = this.userService.getUserById(data.UserId).pipe(
            map(userRes => {
              userRes.TokenKey = data.TokenKey;
              userRes.ExpriedTime = data.ExpriedTime;
              return userRes;
            })
          );
          return user$;
        }
      })
    ).pipe(
      map((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }
    ));
    // return of({
    //   EParkingId: 1,
    //   CustomerId: 5,
    //   Id: 2,
    //   Username: 'cuongnv',
    //   PassWord: '1234',
    //   FullName: 'Nfdsfdsfdsfdsdng',
    //   Sex: true,
    //   Dob: null,
    //   Mobile: '',
    //   Email: '',
    //   Address: 'Hà Nội',
    //   Zalo: '',
    //   Skype: '',
    //   Facebook: '',
    //   AccountNumber: '',
    //   Bank: '',
    //   RoleId: 2,
    //   Image: 'fdsfadsfdsadsaafdas',
    //   Actived: true,
    //   TokenKey: '1234567890',
    // }).pipe(
    //   map((user) => {
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     this.currentUserSubject.next(user);
    //     return user;
    //   })
    // );
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

  encodePassword(password: string): string {
    const saltPassword = password + '123eparking@';
    return encode(saltPassword);
  }

  getBrowserName(): string {
    const ua = navigator.userAgent;
    let b: string;
    let browser: string;
    if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR/') !== -1) {
      b = browser = 'Opera';
    }
    if (ua.indexOf('Firefox') !== -1 && ua.indexOf('Opera') === -1) {
      b = browser = 'Firefox';
      // Opera may also contains Firefox
    }
    if (ua.indexOf('Chrome') !== -1) {
      b = browser = 'Chrome';
    }
    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
      b = browser = 'Safari';
      // Chrome always contains Safari
    }

    if (ua.indexOf('MSIE') !== -1 && (ua.indexOf('Opera') === -1 && ua.indexOf('Trident') === -1)) {
      b = 'MSIE';
      browser = 'Internet Explorer';
      // user agent with MSIE and Opera or MSIE and Trident may exist.
    }
    if (ua.indexOf('Trident') !== -1) {
      b = 'Trident';
      browser = 'Internet Explorer';
    }
    return browser;
  }

  getOS(): string {
    let OSName = 'Unknown OS';
    if (navigator.appVersion.indexOf('Win') !== -1) { OSName = 'Windows'; }
    if (navigator.appVersion.indexOf('Mac') !== -1) { OSName = 'MacOS'; }
    if (navigator.appVersion.indexOf('X11') !== -1) { OSName = 'UNIX'; }
    if (navigator.appVersion.indexOf('Linux') !== -1) { OSName = 'Linux'; }
    return OSName;
  }

  getIpClient() {
    return this.http.get('http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK') // ...using post request '
  ; // ...and calling .json() on the response to return data
    //.catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
}
}
