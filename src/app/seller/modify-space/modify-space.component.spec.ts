import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySpaceComponent } from './modify-space.component';

describe('ModifySpaceComponent', () => {
  let component: ModifySpaceComponent;
  let fixture: ComponentFixture<ModifySpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifySpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifySpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
