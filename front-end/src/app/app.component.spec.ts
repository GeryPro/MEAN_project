import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';

describe('AppComponent', () => {
  let mockAuthService: AuthService;

  @Component({
    selector: 'app-header',
    template: '',
  })
  class MockHeaderComponent {}

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['autoAuthUser']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
      declarations: [AppComponent, MockHeaderComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call the authService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();

    expect(mockAuthService.autoAuthUser).toHaveBeenCalled();
  });
});
