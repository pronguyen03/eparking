import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      if (route.data.roles && route.data.roles.indexOf(currentUser.RoleId) === -1) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    window.location.href = 'http://delta.com.vn/';
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
