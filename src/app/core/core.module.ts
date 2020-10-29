import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { FooterComponent } from './footer/footer.component';
import { MenuNavItemComponent } from './sidenav/menu-nav-item/menu-nav-item.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent, FooterComponent, MenuNavItemComponent],
  imports: [CommonModule, SharedModule, FlexLayoutModule, TranslateModule],
  exports: [HeaderComponent, SidenavComponent, FooterComponent, TranslateModule],
})
export class CoreModule {}
