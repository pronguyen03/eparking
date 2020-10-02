import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { animateText, indicatorRotate } from 'src/app/animations/animations';
import { NavItem } from 'src/app/shared/classes/nav-item';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-menu-nav-item',
  templateUrl: './menu-nav-item.component.html',
  styleUrls: ['./menu-nav-item.component.scss'],
  animations: [indicatorRotate, animateText],
})
export class MenuNavItemComponent implements OnInit, OnDestroy {
  expanded = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  @Input() linkText: boolean;
  @Input() sideNavState: boolean;

  navStateSubscription: Subscription;
  hover: boolean;

  constructor(public router: Router, private sidenavService: SidenavService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }

    this.navStateSubscription = this.sidenavService.sideNavState$.subscribe((res) => {
      this.sideNavState = res;
      if (!this.sideNavState) {
        this.expanded = false;
      }
    });
  }

  ngOnInit(): void {}

  onItemSelected(item: NavItem): void {
    if (item.isAction) {
      this.sidenavService.hide();
      this.router.navigate([item.route]);
    } else {
      if (!this.expanded) {
        this.sidenavService.show();
      }
      this.expanded = !this.expanded;
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.navStateSubscription) {
      this.navStateSubscription.unsubscribe();
    }
  }

  onHover(value: boolean): void {
    this.hover = value;
  }
}
