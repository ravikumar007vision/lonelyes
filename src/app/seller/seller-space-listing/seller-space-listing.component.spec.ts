import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSpaceListingComponent } from './seller-space-listing.component';

describe('SellerSpaceListingComponent', () => {
  let component: SellerSpaceListingComponent;
  let fixture: ComponentFixture<SellerSpaceListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerSpaceListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerSpaceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
