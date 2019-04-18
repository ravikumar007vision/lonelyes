import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreSpacesComponent } from './explore-spaces.component';

describe('ExploreSpacesComponent', () => {
  let component: ExploreSpacesComponent;
  let fixture: ComponentFixture<ExploreSpacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreSpacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
