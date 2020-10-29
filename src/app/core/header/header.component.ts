import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: MatSidenav;
  languages: { key: string, display: string}[] = [
    { key: 'vi', display: 'Tiếng Việt'},
    { key: 'en', display: 'English' },
  ];
  public selectedLang = 'vi';
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void { }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
  }
}
