import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentSectionComponent } from './rent-section.component';

describe('RentSectionComponent', () => {
  let component: RentSectionComponent;
  let fixture: ComponentFixture<RentSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
