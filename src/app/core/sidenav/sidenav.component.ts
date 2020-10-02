import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@app/shared/classes/menu-item';
import { AuthenticationService } from '@app/shared/services/authentication.service';
import { MenuService } from '@app/shared/services/menu.service';
import { Observable } from 'rxjs';
import { animateText, onSideNavChange } from 'src/app/animations/animations';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [onSideNavChange, animateText],
})
export class SidenavComponent implements OnInit {
  public sideNavState = false;
  public linkText = false;
  public listMenu$: Observable<MenuItem[]>;

  constructor(
    private sidenavService: SidenavService,
    private authService: AuthenticationService,
    private menuService: MenuService
  ) {
    this.sidenavService.sideNavState$.subscribe((res) => {
      this.sideNavState = res;
      if (this.sideNavState) {
        setTimeout(() => {
          this.linkText = this.sideNavState;
        }, 200);
      } else {
        setTimeout(() => {
          this.linkText = this.sideNavState;
        }, 75);
      }
    });

    this.getListMenu();
  }

  ngOnInit(): void {}

  onSinenavToggle(): void {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this.sidenavService.sideNavState$.next(this.sideNavState);
  }

  getListMenu(): void {
    this.authService.currentUser.subscribe((user) => {
      if (user && user.TokenKey) {
        this.listMenu$ = this.menuService.getMenusByRoleId(user.RoleId, 0);
      }
    });
  }
}
