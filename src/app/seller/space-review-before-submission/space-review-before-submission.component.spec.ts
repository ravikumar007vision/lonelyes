import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceReviewBeforeSubmissionComponent } from './space-review-before-submission.component';

describe('SpaceReviewBeforeSubmissionComponent', () => {
  let component: SpaceReviewBeforeSubmissionComponent;
  let fixture: ComponentFixture<SpaceReviewBeforeSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceReviewBeforeSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceReviewBeforeSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
