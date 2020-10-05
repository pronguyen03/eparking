import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): Date {
    const year = +value.substring(0, 4);
    const month = +value.substring(4, 6);
    const day = +value.substring(6, 8);
    const hour = +value.substring(8, 10);
    const minute = +value.substring(10, 12);
    return new Date(year, month, day, hour, minute);
  }
}
