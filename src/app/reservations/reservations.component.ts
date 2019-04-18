import { Component, OnInit } from '@angular/core';
import { SpaceService, AuthenticationService, UserService, AppAlertService, DataService } from '../_services';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// import * as Stripe from 'stripe';
@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  user: any;
  bookingList: any;
  currentDate: any;

  spaceName: any;
  spaceID: any;
  booking_id: any;
  noReservations: any = true;

  private modalRef: any;

  feedbackForm: FormGroup;
  rating_stars: any = 0;

  public limit = 3;
  public slicei: any = 0;
  public slicea: any = this.limit;
  public page: any = 1;
  public lastpage: any;

  private stripeKey = environment.stripeKey;
  private stripeImage = environment.stripeImage;
  private generatedToken: any;

  reviewSubmitted: any = false;
  constructor(private spacesService: SpaceService,
    private alert: AppAlertService,
    private dataService: DataService,
    private http: HttpClient,
    private modalService: NgbModal,
    private titleService: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService, ) {
    this.user = this.userService.getUserData() || [];

    this.feedbackForm = this.formBuilder.group({
      rating_stars: new FormControl('', Validators.required),
      feedback: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(500), Validators.minLength(50)])),
    });
  }

  ngOnInit() {
    this.titleService.setTitle('My Reservations : : Lonely Spaces');
    this.currentDate = new Date();
    this.spacesService.getBookings(this.user.id, 'buyer').then((response) => {
      console.log(response);
      if (response['status'] && response['data']) {
        this.bookingList = response['data'];
        this.lastpage = Math.ceil(this.bookingList.length / this.limit);
        this.noReservations = false;
      } else if (!response['status'] && response['data']) {
        this.noReservations = true;
      } else {
        this.alert.error('Something went wrong. Try again later');
      }
    });

  }

  doTrim(INtext, INlength) {
    return this.dataService.doTrim(INtext, INlength);
  }

  getStatus(from_Date: Date, to_Date: Date) {
    let from_DATE = new Date(from_Date);
    let to_DATE = new Date(to_Date);
    if (this.currentDate < to_DATE && this.currentDate >= from_DATE) {
      return ('ongoing');
    } else if (this.currentDate < to_DATE && this.currentDate < from_DATE) {
      return ('upcoming');
    } else {
      return ('past');
    }
  }

  openmodal(content, spaceName, spaceID, bookingID) {
    this.modalRef = this.modalService.open(content);
    this.spaceName = spaceName;
    this.booking_id = bookingID;
    this.spaceID = spaceID;
    this.reviewSubmitted = false;

    this.spacesService.getFeedback(this.booking_id, this.spaceID, this.user.id).then(response => {
      console.log(response);
      if (response['status'] && response['data']) {
        this.feedbackForm.controls['feedback'].setValue(response['data']['review']);
        this.rating_stars = response['data']['rate'];
      } else if (!response['status'] && response['errors']) {
        this.feedbackForm.controls['feedback'].setValue(null);
      } else {
        this.alert.error('Something went wrong, Try later');
      }
    });
  }

  postFeedback() {
    this.spacesService.postSpaceFeedback(this.user.id, this.spaceID, this.booking_id, this.feedbackForm.value).then(data => {
      console.log(data);
      if (data['status'] && data['data']) {
        this.reviewSubmitted = true;
        setTimeout(() => {
          this.modalRef.close();
        }, 2000);
      } else {
        this.alert.error('Something went wrong. Try later');
      }
    });
  }
  mLeft() {
    this.slicei = 0;
    this.slicea = this.limit;
    this.page = 1;
  }

  mRight() {
    if (this.bookingList.length > this.limit) {
      this.slicei = (this.lastpage * this.limit) - this.limit;
      this.slicea = this.bookingList.length;
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

  goto(space_id) {
    const navigationExtras: NavigationExtras = { queryParams: { 'spaceID': space_id } };
    this.router.navigate(['space-detail'], navigationExtras);
  }

  doPayment(booking_id, payment_status) {
    const body = { booking_id: booking_id, payment_status: 1 }
    this.spacesService.makePayment(body).then(response => {
      console.log(response);
      if (response['status']) {
        this.alert.success('Payment Successful');
        this.ngOnInit();
      }
    });
  }

  doPayment1(booking_id, payment_status) {
    // const body = { booking_id: booking_id, payment_status: 1 }
    // this.spacesService.makePayment(body).then(response => {
    //   console.log(response);
    //   if (response['status']) {
    //     this.alert.success('Payment Successful');
    //     this.ngOnInit();
    //   }
    // });



    // var stripe = require("stripe")("sk_test_D5mNPR2St9hvZUqIA3QxyUKG");

    // (async () => {
    //   const charge = await stripe.charges.create({
    //     amount: 999,
    //     currency: 'usd',
    //     source: 'tok_visa',
    //     receipt_email: 'jenny.rosen@example.com',
    //   });
    // })();
  }


  pay() {
    // var stripe = require("stripe")("sk_test_D5mNPR2St9hvZUqIA3QxyUKG");

    // (async () => {
    //   const charge = await stripe.charges.create({
    //     amount: 999,
    //     currency: 'usd',
    //     source: 'tok_visa',
    //     receipt_email: 'jenny.rosen@example.com',
    //   });
    // })();

    console.log('hi');
    const handler = (<any>window).StripeCheckout.configure({
      key: this.stripeKey,
      image: this.stripeImage,
      locale: 'auto',
      token: (token: any) => {
        console.log(JSON.stringify(token));
        this.generatedToken = token;
        this.sendToken();
      }
    });
    handler.open({
      name: 'Lonely Space',
      description: 'The Medieval Spaces',
      amount: 200
    });
  }

  sendToken() {
    let data = 'token=' + this.generatedToken;

    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3333/processpay', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        });
    });
  }



}
