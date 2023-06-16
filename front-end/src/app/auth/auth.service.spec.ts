import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

const BACKEND_URL = 'http://localhost:3000/api/user/';

describe('AuthService', () => {
  let httpTestingController: HttpTestingController;
  let router: Router;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [AuthService],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should call login with the correct URL and method', () => {
    const email = 'test@test.com';
    const password = 'test';
    service.login(email, password);

    const req = httpTestingController.expectOne(`${BACKEND_URL}login`);

    httpTestingController.verify();

    expect(req.request.method).toBe('POST');
  });

  it('should navigate to home page ("/") when successfully login', () => {
    const email = 'test@test.com';
    const password = 'test';
    const navigateSpy = spyOn(router, 'navigate');
    service.login(email, password);

    const req = httpTestingController.expectOne(`${BACKEND_URL}login`);
    req.flush({
      expiresIn: 600,
      userId: '12',
      token: 'new token',
    });
    httpTestingController.verify();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should call createUser with the correct URL and method', () => {
    const email = 'test@test.com';
    const password = 'test';

    service.createUser(email, password);

    const req = httpTestingController.expectOne(`${BACKEND_URL}signup`);

    httpTestingController.verify();

    expect(req.request.method).toBe('POST');
  });

  it('should navigate to login page when user has been successfully created', () => {
    const email = 'test@test.com';
    const password = 'test';
    const navigateSpy = spyOn(router, 'navigate');

    service.createUser(email, password);

    const req = httpTestingController.expectOne(`${BACKEND_URL}signup`);
    req.flush({});

    httpTestingController.verify();

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
