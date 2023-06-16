import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import { HeaderComponent } from './header.component';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' },
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigateTo: any = null;

  onClick() {
    this.navigateTo = this.linkParams;
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: any;

  @Component({
    selector: 'mat-toolbar',
    template: '<ng-content></ng-content>',
  })
  class MockMatToolbar {}

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj([
      'getIsAuth',
      'getAuthStatusListener',
      'logout',
    ]);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, MockMatToolbar, RouterLinkDirectiveStub],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should show 2 buttons if the user is not authenticated', () => {
    mockAuthService.getIsAuth.and.returnValue(false);
    mockAuthService.getAuthStatusListener.and.returnValue(of(false));

    fixture.detectChanges();

    const buttonsArray = fixture.nativeElement.querySelectorAll('li a').length;

    expect(buttonsArray).toBe(2);

    for (let i = 0; i < buttonsArray.length; i++) {
      const buttonsText = ['Login', 'Signup'];

      expect(buttonsArray[i]).toContain(buttonsText[i]);
    }
  });

  it('should show "New Post" button if user is authenticated', () => {
    mockAuthService.getIsAuth.and.returnValue(true);
    mockAuthService.getAuthStatusListener.and.returnValue(of(true));

    fixture.detectChanges();

    const newPostBtn = fixture.nativeElement.querySelector('li a');

    expect(newPostBtn).toBeTruthy();
  });

  it('should show Logout button if user is authenticated', () => {
    mockAuthService.getIsAuth.and.returnValue(true);
    mockAuthService.getAuthStatusListener.and.returnValue(of(true));

    fixture.detectChanges();

    const logoutBtn = fixture.nativeElement.querySelector('li button');

    expect(logoutBtn).toBeTruthy();
  });

  it('should call onLogout method if logout button is pressed', () => {
    mockAuthService.getIsAuth.and.returnValue(true);
    mockAuthService.getAuthStatusListener.and.returnValue(of(true));

    fixture.detectChanges();

    const logoutBtn = fixture.debugElement.query(By.css('li button'));

    spyOn(component, 'onLogout');
    logoutBtn.triggerEventHandler('click', null);

    expect(component.onLogout).toHaveBeenCalled();
  });

  it('should call authService.logout if onLogout is called', () => {
    mockAuthService.getIsAuth.and.returnValue(true);
    mockAuthService.getAuthStatusListener.and.returnValue(of(true));

    fixture.detectChanges();

    const logoutBtn = fixture.debugElement.query(By.css('li button'));

    logoutBtn.triggerEventHandler('click', null);

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it(`should have the correct route for "MyMessages" logo`, () => {
    mockAuthService.getIsAuth.and.returnValue(true);
    mockAuthService.getAuthStatusListener.and.returnValue(of(true));

    fixture.detectChanges();

    const logo = fixture.debugElement.query(By.css('#logo'));
    const routerLink = logo
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);
    logo.query(By.css('a')).triggerEventHandler('click', null);
    expect(routerLink.navigateTo).toBe('/');
  });
});
