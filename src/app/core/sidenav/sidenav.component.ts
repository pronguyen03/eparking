import { Component, OnInit } from '@angular/core';
import { animateText, onSideNavChange } from 'src/app/animations/animations';
import { NavItem } from 'src/app/shared/classes/nav-item';
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
  public routes: NavItem[] = [
    {
      name: 'Danh Mục',
      icon: 'menu',
      isAction: false,
      childs: [
        { name: 'Khách Hàng', route: '/customers', isAction: true },
        { name: 'Loại Xe', route: '/type-of-cars', isAction: true },
        { name: 'Người dùng', route: '/users', isAction: true },
        { name: 'Giá', route: '/prices', isAction: true },
      ],
    },
    { name: 'Starred', route: 'some-link', icon: 'star', isAction: true },
    { name: 'Send email', route: 'some-link', icon: 'send', isAction: true },
  ];

  constructor(private sidenavService: SidenavService) {
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
  }

  ngOnInit(): void {}

  onSinenavToggle(): void {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
    this.sidenavService.sideNavState$.next(this.sideNavState);
  }
}
