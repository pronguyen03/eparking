import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  activeRequest = 0;

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const body = request.body;
    const isValidatorRequest = body.isValidatorRequest;
    if (this.activeRequest === 0) {
      if (!isValidatorRequest) {
        this.spinner.show();
      }
    }

    if (!isValidatorRequest) {
      this.activeRequest++;
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (!isValidatorRequest) {
          this.activeRequest--;
        }
        if (this.activeRequest === 0) {
          this.spinner.hide();
        }
      })
    );
  }
}
