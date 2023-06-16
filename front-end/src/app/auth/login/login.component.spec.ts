import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';

import { LoginComponent } from './login.component';

@Component({
  selector: 'mat-card',
  template: '<ng-content></ng-content>',
})
class FakeMatCardComponent {}

@Component({
  selector: 'mat-form-field',
  template: '<ng-content></ng-content>',
})
class FakeMatFormFieldComponent {}

@Component({
  selector: 'mat-spinner',
  template: '<ng-content></ng-content>',
})
class FakeMatSpinnerComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['getAuthStatusListener', 'login']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        LoginComponent,
        FakeMatCardComponent,
        FakeMatFormFieldComponent,
        FakeMatSpinnerComponent,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService.getAuthStatusListener.and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should call authService.login if the form input is valid', () => {
    const testForm = <NgForm>{
      value: {
        email: 'test@test.com',
        password: 'testpassword',
      },
      invalid: false,
    };

    component.onLogin(testForm);

    expect(mockAuthService.login).toHaveBeenCalledWith(
      testForm.value.email,
      testForm.value.password
    );
  });

  it('should not call authService.login if the form input is invalid', () => {
    const testForm = <NgForm>{
      value: {
        email: '',
        password: '',
      },
      invalid: true,
    };

    component.onLogin(testForm);

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should show a loading spinner if the component is currently loading smth', () => {
    component.isLoading = true;

    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.directive(FakeMatSpinnerComponent)
    );

    expect(spinner).toBeTruthy();
  });

  it('should show a h2 tag with "Login" text if the component is currently not loading', () => {
    const title = fixture.nativeElement.querySelector('h2');

    expect(title.textContent).toEqual('Login');
  });

  it('should show the login form if the component is currently not loading', () => {
    const form = fixture.nativeElement.querySelector('form');

    expect(form).toBeTruthy();
  });
});
