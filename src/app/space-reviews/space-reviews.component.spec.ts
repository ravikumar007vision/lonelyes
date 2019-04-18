import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceReviewsComponent } from './space-reviews.component';

describe('SpaceReviewsComponent', () => {
  let component: SpaceReviewsComponent;
  let fixture: ComponentFixture<SpaceReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
