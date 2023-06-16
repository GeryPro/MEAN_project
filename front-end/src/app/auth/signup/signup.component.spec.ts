import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';

import { SignupComponent } from './signup.component';

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

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj([
      'getAuthStatusListener',
      'createUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        SignupComponent,
        FakeMatCardComponent,
        FakeMatFormFieldComponent,
        FakeMatSpinnerComponent,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    mockAuthService.getAuthStatusListener.and.returnValue(of(false));
    fixture.detectChanges();
  });

  it('should call authService.createUser if the form input is valid', () => {
    const testForm = <NgForm>{
      value: {
        email: 'test@test.com',
        password: 'testpassword',
      },
      invalid: false,
    };

    component.onSignup(testForm);

    expect(mockAuthService.createUser).toHaveBeenCalledWith(
      testForm.value.email,
      testForm.value.password
    );
  });

  it('should not call authService.createUser if the form input is invalid', () => {
    const testForm = <NgForm>{
      value: {
        email: '',
        password: '',
      },
      invalid: true,
    };

    component.onSignup(testForm);

    expect(mockAuthService.createUser).not.toHaveBeenCalled();
  });

  it('should show a loading spinner if the component is currently loading smth', () => {
    component.isLoading = true;

    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.directive(FakeMatSpinnerComponent)
    );

    expect(spinner).toBeTruthy();
  });

  it('should show a h2 tag with "Join us!" text if the component is currently not loading', () => {
    const title = fixture.nativeElement.querySelector('h2');

    expect(title.textContent).toEqual('Join us!');
  });

  it('should show the sign up form if the component is currently not loading', () => {
    const form = fixture.nativeElement.querySelector('form');

    expect(form).toBeTruthy();
  });
});
