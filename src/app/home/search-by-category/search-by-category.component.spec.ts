import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByCategoryComponent } from './search-by-category.component';

describe('SearchByCategoryComponent', () => {
  let component: SearchByCategoryComponent;
  let fixture: ComponentFixture<SearchByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
