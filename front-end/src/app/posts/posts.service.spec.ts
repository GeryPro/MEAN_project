import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PostsService } from './posts.service';

const BACKEND_URL = 'http://localhost:3000/api/posts';

describe('PostsService', () => {
  let httpTestingController: HttpTestingController;
  let router: Router;
  let service: PostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    });
    service = TestBed.inject(PostsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should call getPosts with the correct URL, params and method', () => {
    const postsPerPage = 10;
    const currentPage = 2;
    service.getPosts(postsPerPage, currentPage);

    const req = httpTestingController.expectOne(
      `${BACKEND_URL}?pagesize=${postsPerPage}&page=${currentPage}`
    );

    httpTestingController.verify();

    expect(req.request.method).toBe('GET');
  });

  it('should call getPost with the correct URL and method', () => {
    const id = '2';
    service.getPost(id).subscribe((data) => {});

    const req = httpTestingController.expectOne(`${BACKEND_URL}/${id}`);

    httpTestingController.verify();

    expect(req.request.method).toBe('GET');
  });

  it('should call addPost with the correct URL and method', () => {
    const title = 'title';
    const content = 'content';
    let blob = new Blob([''], { type: 'image/png' });
    const image = <File>blob;

    service.addPost(title, content, image);

    const req = httpTestingController.expectOne(BACKEND_URL);

    httpTestingController.verify();

    expect(req.request.method).toBe('POST');
  });

  it('should navigate to home page ("/") when a post is added', () => {
    const title = 'title';
    const content = 'content';
    let blob = new Blob([''], { type: 'image/png' });
    const image = <File>blob;
    const navigateSpy = spyOn(router, 'navigate');

    service.addPost(title, content, image);

    const req = httpTestingController.expectOne(BACKEND_URL);
    req.flush({});

    httpTestingController.verify();

    expect(navigateSpy).toHaveBeenCalledOnceWith(['/']);
  });

  it('should call updatePost with the correct URL and method', () => {
    const id = '1';

    service.updatePost(id, 'title', 'content', 'image path');

    const req = httpTestingController.expectOne(`${BACKEND_URL}/${id}`);

    httpTestingController.verify();

    expect(req.request.method).toBe('PUT');
  });

  it('should navigate to home page ("/") when a post is updated', () => {
    const id = '1';
    const navigateSpy = spyOn(router, 'navigate');

    service.updatePost(id, 'title', 'content', 'image path');

    const req = httpTestingController.expectOne(`${BACKEND_URL}/${id}`);
    req.flush({});

    httpTestingController.verify();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should call deletePost with the correct URL and method', () => {
    const id = '1';

    service.deletePost(id).subscribe();

    const req = httpTestingController.expectOne(`${BACKEND_URL}/${id}`);

    httpTestingController.verify();

    expect(req.request.method).toBe('DELETE');
  });
});
