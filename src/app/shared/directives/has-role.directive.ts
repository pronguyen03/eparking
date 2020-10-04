import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Role } from '../enums/role.enum';
import { AuthenticationService } from '../services/authentication.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: Role[];

  stop$ = new Subject();

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.verifyRole();
  }

  verifyRole(): void {
    const roleId = this.authService.currentUserValue?.RoleId;
    if (!roleId) {
      this.viewContainerRef.clear();
    }

    if (this.appHasRole.includes(roleId)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }
}
