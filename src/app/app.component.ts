import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { onMainContentChange } from './animations/animations';
import { IUser } from './shared/interfaces/user';
import { AuthenticationService } from './shared/services/authentication.service';
import { SidenavService } from './shared/services/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [onMainContentChange]
})
export class AppComponent {
  public onSideNavChange: boolean;
  currentUser: IUser;
  hasFooter = true;

  constructor(
    public translate: TranslateService,
    private sidenavService: SidenavService,
    private authenticationService: AuthenticationService
  ) {
    translate.addLangs(['en', 'vi']);
    translate.setDefaultLang('vi');
    translate.use('vi');
    this.sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
    this.authenticationService.currentUser.subscribe((x) => (this.currentUser = x));
  }
}
