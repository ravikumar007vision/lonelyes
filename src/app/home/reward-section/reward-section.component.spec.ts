import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardSectionComponent } from './reward-section.component';

describe('RewardSectionComponent', () => {
  let component: RewardSectionComponent;
  let fixture: ComponentFixture<RewardSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
