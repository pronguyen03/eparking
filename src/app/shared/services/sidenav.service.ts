import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  public sideNavState$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() {}

  show(): void {
    this.sideNavState$.next(true);
  }

  hide(): void {
    this.sideNavState$.next(false);
  }
}
