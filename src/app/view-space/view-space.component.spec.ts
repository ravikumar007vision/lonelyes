import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSpaceComponent } from './view-space.component';

describe('ViewSpaceComponent', () => {
  let component: ViewSpaceComponent;
  let fixture: ComponentFixture<ViewSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
