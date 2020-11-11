import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { encode } from 'js-base64';
import { UserService } from './user.service';
import { ApiResponse } from '../interfaces/api-response';
import { IUser } from '../interfaces/user';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;
  public isAuthenticated: boolean;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, saveProfile: boolean): Observable<any> {
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
      map((res: ApiResponse) => {
        if (res.Code !== '102') {
          const data = res.Data;
          const user: IUser = data.Item;
          user.TokenKey = data.TokenKey;
          return user;
        }
      })
    ).pipe(
      map((user) => {
        if (saveProfile) {
          localStorage.setItem('loginInfo', JSON.stringify({username, password}));
        } else {
          localStorage.removeItem('loginInfo');
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }
    ));
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
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
