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
  urlsToNotUse: string[];
  constructor(
    private spinner: NgxSpinnerService
  ) {
    this.urlsToNotUse = [
      '/assets/i18n'
    ];
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isValidRequestForInterceptor(request.url)) {
      const body = request.body;
      const isValidatorRequest = body?.isValidatorRequest;
      if (this.activeRequest === 0) {
        if (!isValidatorRequest ) {
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
    return next.handle(request);
  }

  isValidRequestForInterceptor(requestUrl: string): boolean {
    const positionIndicator = 'api/';
    const position = requestUrl.indexOf(positionIndicator);
    if (position > -1) {
      const destination: string = requestUrl.substr(position + positionIndicator.length);
      for (const address of this.urlsToNotUse) {
        if (new RegExp(address).test(destination)) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
}
