import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../posts.service';

import { PostCreateComponent } from './post-create.component';

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
	template: '',
})
class FakeMatSpinnerComponent {}

@Component({
	selector: 'mat-error',
	template: '<ng-content></ng-content>',
})
class FakeMatErrorComponent {}

describe('PostCreateComponent', () => {
	let component: PostCreateComponent;
	let fixture: ComponentFixture<PostCreateComponent>;
	let mockAuthService: any;
	let mockPostsService: any;

	beforeEach(async () => {
		mockAuthService = jasmine.createSpyObj(['getAuthStatusListener']);
		mockPostsService = jasmine.createSpyObj([
			'getPosts',
			'addPost',
			'updatePost',
		]);

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [
				PostCreateComponent,
				FakeMatCardComponent,
				FakeMatFormFieldComponent,
				FakeMatSpinnerComponent,
				FakeMatErrorComponent,
			],
			providers: [
				{ provide: PostsService, useValue: mockPostsService },
				{ provide: AuthService, useValue: mockAuthService },
				{
					provide: ActivatedRoute,
					useValue: {
						paramMap: of(convertToParamMap({})),
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(PostCreateComponent);
		component = fixture.componentInstance;

		mockAuthService.getAuthStatusListener.and.returnValue(of(true));
		fixture.detectChanges();
	});

	it('should show a loading spinner if the component is currently loading', () => {
		component.isLoading = true;
		fixture.detectChanges();

		const spinner = fixture.debugElement.query(
			By.directive(FakeMatSpinnerComponent)
		);

		expect(spinner).toBeTruthy();
	});

	it('should show the form if the component is not currently loading', () => {
		const form = fixture.debugElement.query(By.css('form'));

		expect(form).toBeTruthy();
	});

	it('should show a "Pick image" button as part of the form', () => {
		const savePostBtnText = fixture.nativeElement
			.querySelector('#pick-image-btn')
			.textContent.trim();

		expect(savePostBtnText).toEqual('Pick image');
	});

	it('should show a "Save Post" button as part of the form', () => {
		const savePostBtnText = fixture.nativeElement
			.querySelector('#save-post-btn')
			.textContent.trim();

		expect(savePostBtnText).toEqual('Save Post');
	});
});
