import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { DataService, SpaceService, AppAlertService, UserService, AuthenticationService } from '../_services';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-view-space',
  templateUrl: './view-space.component.html',
  styleUrls: ['./view-space.component.css']
})
export class ViewSpaceComponent implements OnInit {
  contactSellerForm: FormGroup;
  user: any;
  body: any;
  spaceNoAvail: any;
  spaceBookings: any;
  private spaceID: any;
  private spaceDetails: any;
  private IncomingAmenityList: any;
  // private IncomingAmenityNamesListArr: any = [];
  private FinalAmenityList: any = '';

  // private SpaceTypes: any = [];
  // private CapacityList: any = [];
  // private AmenityList: any = [];
  // private CanPolicyList: any = [];

  mapURL: any;

  PrimaryDataLoaded: any = false;
  SecondaryDataLoaded: any = false;

  inComingPics: any = [];
  picURL = environment.picURL;
  googleMapURL = environment.googleMapURL;
  googleMapAPIKey = environment.googleMapAPIKey;
  public selfowner = false;

  SimilarSpaces: any;
  inWishlist: any;
  profile_URL = environment.profilePicURL;


  constructor(private _route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private spacesService: SpaceService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private alert: AppAlertService,
    private dataService: DataService) {
    this.user = this.userService.getUserData() || [];

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.contactSellerForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')
      ])),
      message: new FormControl('', [Validators.required, Validators.minLength(30)]),
    });
  }

  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      this.spaceID = params['spaceID'];
      this.mainFuction(this.spaceID);
      this.spinner.show();
    });
  }

  mainFuction(spaceID) {
    if (this.user.id === undefined) {
      this.body = { 'id': spaceID, user_id: 0 };
    } else {
      this.body = { 'id': spaceID, user_id: this.user.id };
    }

    this.spacesService.viewSpace(this.body).then(data => {
      console.log(data);
      this.spinner.hide();
      if (data['status']) {
        this.spaceDetails = data['data'];
        this.spaceNoAvail = data['no_ar'];
        this.spaceBookings = data['booking'];
        this.IncomingAmenityList = data['amenities'];
        if (this.spaceDetails.owner_id == this.user.id) {
          this.selfowner = true;
        }
        this.inComingPics = this.spaceDetails.picture.split(',');
        this.PrimaryDataLoaded = true;
        this.inWishlist = (this.spaceDetails.wishlist_id === null) ? false : true;
        let url = this.googleMapURL + this.spaceDetails.city + ',' + this.spaceDetails.state + '&key=' + this.googleMapAPIKey;
        this.mapURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      }
    });

    this.spacesService.getSimilarSpaces().then(data => {
      console.log(data);
      if (data['status'] && data['data']) {
        this.SimilarSpaces = data['data'];
      } else if (!data['status'] && data['data'] == '') {
        this.SimilarSpaces = '';
      } else {
        this.alert.error('Something went wrong.');
      }
    });
  }


  enquiryToSeller() {
    // console.log(this.contactSellerForm.value);
    this.spacesService.contactSeller(this.contactSellerForm.value, this.spaceDetails.owner_id).then(data => {
      if (data['status']) {
        this.alert.success('Enquiry Submitted Successfully.');
        this.contactSellerForm.reset();
      } else {
        this.alert.error('Something went wrong. Try later.');
      }
    });
  }

  // view space in same page
  viewSpace(spaceID) {
    this.mainFuction(spaceID);
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': spaceID }
    };
    this.router.navigate([], navigationExtras);
  }

  // toggle to add/remove from wishlist
  toggleLike() {
    if (this.auth.isUserLoggedIn()) {
      this.inWishlist = (this.inWishlist) ? false : true;
      this.spacesService.toggleWishlist(this.user.id, this.spaceDetails.id).then(data => {
        console.log(data);
        if (data['status'] && data['data'] === 'Added') {
          this.alert.success('Added to wishlist.');
        } else if (data['status'] && data['data'] === 'Remove From Wishlist') {
          this.alert.error('Removed From Wishlist.');
        } else {
          this.alert.error('Something went wrong. Try later.');
        }
      });
    } else {
      this.alert.error('Please login to create wishlist.');
    }
  }

  bookSpace() {
    if (this.selfowner) {
      // alert('you are owner of this space');
      this.alert.error('you are owner of this space');
      return false;
    } else {
      localStorage.setItem('spaceDetails', JSON.stringify([this.spaceDetails, this.spaceNoAvail, this.spaceBookings]));
      const navigationExtras: NavigationExtras = { queryParams: { 'spaceID': this.spaceDetails['id'] } };
      this.router.navigate(['booking'], navigationExtras);
    }
  }
  viewReviews() {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': this.spaceID }
    };
    this.router.navigate(['space-reviews'], navigationExtras);
  }

  initiateChat() {
    this.dataService.tempData = {
      space_id: this.spaceID,
      space_name: this.spaceDetails.title,
      space_owner: this.spaceDetails.owner_id
    };
    this.router.navigate(['chat']);
  }
}
