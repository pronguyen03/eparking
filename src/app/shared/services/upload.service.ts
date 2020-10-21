import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  routeUrl = 'Images';


  constructor() { }

  // upload(formData: FormData): Observable<any> {
  //   return of
  // }
}
