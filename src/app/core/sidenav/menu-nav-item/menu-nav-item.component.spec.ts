import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNavItemComponent } from './menu-nav-item.component';

describe('MenuNavItemComponent', () => {
  let component: MenuNavItemComponent;
  let fixture: ComponentFixture<MenuNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuNavItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
