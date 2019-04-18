import { Component, OnInit } from '@angular/core';
import { AppAlertService, SpaceService } from '../_services';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-space-reviews',
  templateUrl: './space-reviews.component.html',
  styleUrls: ['./space-reviews.component.css']
})
export class SpaceReviewsComponent implements OnInit {
  space_id: any;
  reviewList: any;
  spaceDetails: any;
  rating: any;
  SimilarSpaces: any;
  profile_picURL = environment.profilePicURL;
  space_picURL = environment.picURL;

  public limit = 5;
  public slicei: any = 0;
  public slicea: any = this.limit;
  public page: any = 1;
  public lastpage: number;

  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private alert: AppAlertService,
    private spacesService: SpaceService) { }

  ngOnInit() {
    this.titleService.setTitle('Space Reviews : : ');

    this._route.queryParams.subscribe(params => {
      this.space_id = params['spaceID'];
      this.getReviews();
    });
  }


  getReviews() {
    this.spinner.show();
    this.spacesService.getAllReviews(this.space_id).then(response => {
      console.log(response);
      this.spinner.hide();
      if (response['status'] && response['data']) {
        this.reviewList = response['data'];
        this.rating = response['rating'][0];
        this.spaceDetails = response['total'];
        this.titleService.setTitle('Space Reviews : : ' + response['total']['title']);
        this.lastpage = Math.ceil(this.reviewList.length / this.limit);
      } else {
        this.alert.error('Something went wrong. Try later.');
      }
    });

    // get similar spaces
    this.spacesService.getSimilarSpaces().then(data => {
      // console.log(data);
      if (data['status'] && data['data']) {
        this.SimilarSpaces = data['data'];
      } else if (!data['status'] && data['data'] === '') {
        this.SimilarSpaces = '';
      } else {
        this.alert.error('Something went wrong. Try again later.');
      }
    });
  }



  mLeft() {
    this.slicei = 0;
    this.slicea = this.limit;
    this.page = 1;
  }

  mRight() {
    if (this.reviewList.length > this.limit) {
      this.slicei = (this.lastpage * this.limit) - this.limit;
      this.slicea = this.reviewList.length;
      this.page = this.lastpage;
    }
  }

  fLeft() {
    if (this.page > 1) {
      this.page -= 1;
      this.slicei = (this.page - 1) * this.limit;
      this.slicea = ((this.page - 1) * this.limit) + this.limit;
    }
  }

  fRight() {
    if (this.lastpage > this.page) {
      this.page += 1;
      this.slicei = (this.page - 1) * this.limit;
      this.slicea = ((this.page - 1) * this.limit) + this.limit;
    }
  }


  // view space in same page
  viewSpace(spaceID) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': spaceID }
    };
    this.router.navigate(['space-detail'], navigationExtras);
  }
}
