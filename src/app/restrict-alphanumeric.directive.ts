import { Directive, ElementRef, HostListener, Self } from '@angular/core';

@Directive({
  selector: '[appRestrictAlphanumeric]'
})
export class RestrictAlphanumericDirective {

  constructor(@Self() private elementRef: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const k = event.keyCode;
    if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57)) {
      return;
    }
    event.preventDefault();
  }

}
