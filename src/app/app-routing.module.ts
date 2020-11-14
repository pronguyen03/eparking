import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Role } from './shared/enums/role.enum';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'master-data',
    loadChildren: () => import('./master-data/master-data.module').then((m) => m.MasterDataModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'request-entry',
    loadChildren: () => import('./request-entry/request-entry.module').then((m) => m.RequestEntryModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'security-staff',
    loadChildren: () => import('./security-staff/security-staff.module').then((m) => m.SecurityStaffModule),
    data: { roles: [Role.PARKING_ADMIN, Role.SECURITY, Role.SYSTEM_ADMIN] },
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
