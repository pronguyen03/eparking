import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
    if (value) {
      return 'YES';
    } else {
      return 'NO';
    }
  }

}
