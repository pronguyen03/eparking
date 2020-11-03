import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((res) => res),
      tap((event) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body.Code !== '100' && !event.url.includes('/assets/i18n')) {
            switch (body.Code) {
              case '101':
                this.authenticationService.logout();
                this.toastr.error(body.Message);
                break;
              default:
                this.toastr.error(body.Message, `Error ${body.Code}`);
                break;
            }
          }
        }
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.authenticationService.logout();
          this.toastr.error('Unauthorised', 'Error 401');
          // location.reload();
        }

        const error = err.error.message || err.statusText;
        // this.toastr.error('Unauthorised', 'Error 401');
        return throwError(error);
      })
    );
  }
}
