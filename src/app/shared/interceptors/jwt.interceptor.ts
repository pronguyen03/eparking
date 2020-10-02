import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.TokenKey;
    if (isLoggedIn) {
      const reqCloned = this.handleBodyIn(request, currentUser.TokenKey, 'TokenKey');
      const copiedReq = reqCloned;
      return next.handle(copiedReq);
    } else {
      return next.handle(request);
      // return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }
  }

  handleBodyIn(req: HttpRequest<any>, tokenToAdd: string, tokenName: string): HttpRequest<any> {
    if (req.method.toLowerCase() === 'post') {
      if (req.body instanceof FormData) {
        req = req.clone({
          body: req.body.append(tokenName, tokenToAdd),
        });
      } else {
        const foo = {};
        foo[tokenName] = tokenToAdd;
        req = req.clone({
          body: { ...req.body, ...foo },
        });
      }
    }
    if (req.method.toLowerCase() === 'get') {
      req = req.clone({
        params: req.params.set(tokenName, tokenName),
      });
    }
    return req;
  }
}
