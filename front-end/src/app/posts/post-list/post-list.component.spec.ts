import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../posts.service';

import { PostListComponent } from './post-list.component';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' },
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigateTo: any = null;

  onClick() {
    this.navigateTo = this.linkParams.join('/');
  }
}

@Component({
  selector: 'mat-spinner',
  template: '',
})
class FakeMatSpinnerComponent {}

@Component({
  selector: 'mat-accordion',
  template: '<ng-content></ng-content>',
})
class FakeMatAccordionComponent {}

@Component({
  selector: 'mat-expansion-panel',
  template: '<ng-content></ng-content>',
})
class FakeExpansionPanelComponent {}

@Component({
  selector: 'mat-expansion-panel-header',
  template: '<ng-content></ng-content>',
})
class FakeExpansionPanelHeaderComponent {}

@Component({
  selector: 'mat-action-row',
  template: '<ng-content></ng-content>',
})
class FakeMatActionRowComponent {}

@Component({
  selector: 'mat-paginator',
  template: '',
})
class FakeMatPaginatorComponent {
  @Input() length: number;
  @Input() pageSize: number;
  @Input() pageSizeOptions: number[];
}

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let mockAuthService: any;
  let mockPostsService: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj([
      'getUserId',
      'getIsAuth',
      'getAuthStatusListener',
    ]);
    mockPostsService = jasmine.createSpyObj([
      'getPosts',
      'getPostsUpdatedListener',
      'deletePost',
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        PostListComponent,
        FakeMatSpinnerComponent,
        FakeMatAccordionComponent,
        FakeMatPaginatorComponent,
        FakeExpansionPanelComponent,
        FakeExpansionPanelHeaderComponent,
        FakeMatActionRowComponent,
        RouterLinkDirectiveStub,
      ],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;

    mockPostsService.getPosts.and.returnValue();
    mockAuthService.getUserId.and.returnValue('10');
    mockPostsService.getPostsUpdatedListener.and.returnValue(
      of({ posts: [], postCount: 10 })
    );
    mockAuthService.getIsAuth.and.returnValue(of(true));
    mockAuthService.getAuthStatusListener.and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should show a loading spinner if the component is currently loading smth', () => {
    component.isLoading = true;

    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.directive(FakeMatSpinnerComponent)
    );

    expect(spinner).toBeTruthy();
  });

  it('should show an accordion of posts', () => {
    component.posts = [
      {
        id: '1',
        title: 'Title',
        content: 'Content',
        imagePath: 'imagePath',
        creator: null,
      },
    ];

    fixture.detectChanges();

    const accordion = fixture.debugElement.query(
      By.directive(FakeMatAccordionComponent)
    );

    expect(accordion).toBeTruthy();
  });

  it('should show "No posts added yet!" if posts were added', () => {
    const infoParagraph = fixture.debugElement
      .query(By.css('p'))
      .nativeElement.textContent.trim();

    expect(infoParagraph).toEqual('No posts added yet!');
  });

  it('should call onDelete method with the correct ID if the Delete button is pressed', () => {
    const onDeleteSpy = spyOn(component, 'onDelete');
    component.userIsAuthenticated = true;
    component.userId = '1';
    component.posts = [
      {
        id: '101',
        title: 'Title',
        content: 'Content',
        imagePath: 'imagePath',
        creator: '1',
      },
    ];

    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.query(By.css('button'));

    deleteBtn.nativeElement.click();

    expect(onDeleteSpy).toHaveBeenCalledWith('101');
  });

  it('should have the correct route for the Edit post a tag', () => {
    component.userIsAuthenticated = true;
    component.userId = '1';
    component.posts = [
      {
        id: '101',
        title: 'Title',
        content: 'Content',
        imagePath: 'imagePath',
        creator: '1',
      },
    ];

    fixture.detectChanges();

    const matActionRow = fixture.debugElement.query(
      By.directive(FakeMatActionRowComponent)
    );
    const routerLink = matActionRow
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    matActionRow.query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigateTo).toBe(`/edit/${component.posts[0].id}`);
  });

  it('should call postsService.deletePost with the correct argument when onDelete is invoked', () => {
    component.userIsAuthenticated = true;
    component.userId = '1';
    component.posts = [
      {
        id: '101',
        title: 'Title',
        content: 'Content',
        imagePath: 'imagePath',
        creator: '1',
      },
    ];

    const { id } = component.posts[0];
    fixture.detectChanges();

    mockPostsService.deletePost.and.returnValue(of(null));
    mockPostsService.getPosts.and.returnValue();

    component.onDelete(id);

    expect(mockPostsService.deletePost).toHaveBeenCalledWith(id);
  });

  it('should update the current page when onChangePage is called', () => {
    const testPageEvent = <PageEvent>{
      pageIndex: 1,
      pageSize: 10,
      length: 100,
    };

    component.onChangedPage(testPageEvent);

    expect(component.currentPage).toEqual(2);
  });

  it('should update the posts per page when onChangePage is called', () => {
    const testPageEvent = <PageEvent>{
      pageIndex: 1,
      pageSize: 10,
      length: 100,
    };

    component.onChangedPage(testPageEvent);

    expect(component.postsPerPage).toEqual(testPageEvent.pageSize);
  });

  it('should call the postsService.getPosts method when onChangePage is invoked', () => {
    const testPageEvent = <PageEvent>{
      pageIndex: 1,
      pageSize: 10,
      length: 100,
    };

    component.onChangedPage(testPageEvent);

    expect(mockPostsService.getPosts).toHaveBeenCalledWith(10, 2);
  });
});
