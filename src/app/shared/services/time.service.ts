import { Injectable } from '@angular/core';
import { format } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor() {}

  convertToDateTime(source: string): Date {
    if (!source) {
      return null;
    }
    const year = +source.substring(0, 4);
    const month = +source.substring(4, 6);
    const day = +source.substring(6, 8);
    const hour = +source.substring(8, 10);
    const minute = +source.substring(10, 12);
    return new Date(year, month - 1, day, hour, minute);
  }

  toDateTimeString(date: Date): string {
    if (!date) {
      return '';
    }
    return format(date, 'yyyyMMddHHmm');
  }

  toDateString(date: Date): string {
    if (!date) {
      return '';
    }
    return format(date, 'yyyyMMdd');
  }
}
