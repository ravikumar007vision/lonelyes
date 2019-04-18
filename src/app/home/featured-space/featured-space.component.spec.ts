import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedSpaceComponent } from './featured-space.component';

describe('FeaturedSpaceComponent', () => {
  let component: FeaturedSpaceComponent;
  let fixture: ComponentFixture<FeaturedSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
