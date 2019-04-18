import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvocateProgramComponent } from './advocate-program.component';

describe('AdvocateProgramComponent', () => {
  let component: AdvocateProgramComponent;
  let fixture: ComponentFixture<AdvocateProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvocateProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvocateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
