import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  languages: { key: string, display: string}[] = [
    { key: 'vi', display: 'Tiếng Việt'},
    { key: 'en', display: 'English' },
  ];
  public selectedLang = 'vi';
  constructor(
    public translate: TranslateService) { }

  ngOnInit(): void {
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
  }
}
