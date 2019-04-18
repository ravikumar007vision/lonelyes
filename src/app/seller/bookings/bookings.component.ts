import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpaceService, AppAlertService, DataService, UserService, MessagingService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  user: any;
  bookingList: any;
  currentDate: any;

  spaceName: any;
  spaceID: any;
  booking_id: any;

  private modalRef: any;
  private currentBookingData: any;
  readyToSendMsg: any = false;
  messageForm: FormGroup;

  noSpaceBooked: any = true;

  qualityStar: any = 0;
  comfortStar: any = 0;
  facilityStar: any = 0;
  public limit = 3;
  public slicei: any = 0;
  public slicea: any = this.limit;
  public page: any = 1;
  public lastpage: any;

  reviewSubmitted: any = false;
  rating_stars: any = 0;
  profile_picURL = environment.profilePicURL;


  feedbackForm: FormGroup;
  renterRatingList: any = [];
  renterAverageRate: any = 0;
  totalRenterReviews: any = 0;
  buyerData: any;

  constructor(private spacesService: SpaceService,
    private alert: AppAlertService,
    private dataService: DataService,
    private msg: MessagingService,
    private titleService: Title,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService, ) {
    this.user = this.userService.getUserData() || [];
    this.feedbackForm = this.formBuilder.group({
      rating_stars: new FormControl('', Validators.required),
      feedback: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(500), Validators.minLength(50)])),
    });
  }

  ngOnInit() {
    this.titleService.setTitle('My Space Bookings : :  Lonely Spaces');
    this.currentDate = new Date();
    this.messageForm = this.formBuilder.group({
      message: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
    this.spacesService.getBookings(this.user.id, 'seller').then((response) => {
      // console.log(response);
      if (response['status'] && response['data']) {
        this.bookingList = response['data'];
        this.lastpage = Math.ceil(this.bookingList.length / this.limit);
        this.noSpaceBooked = false;
        console.log(this.bookingList);
      } else if (!response['status'] && response['data']) {
        this.noSpaceBooked = true;
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

  openmodal(content, data) {
    console.log(data);
    this.modalRef = this.modalService.open(content);
    this.currentBookingData = data;
  }

  confirmBooking(status) {
    console.log(status);
    console.log(this.currentBookingData);
    const body = { booking_id: this.currentBookingData.id, status: status };
    this.spacesService.booking_approval(body).then((result) => {
      console.log(result);
      if (result['status']) {
        this.modalRef.close();
        this.ngOnInit();
      } else {
        this.alert.error('Something went wrong');
      }
    });
  }

  sendMSGToggle() {
    this.readyToSendMsg = (this.readyToSendMsg) ? false : true;
  }

  sendMsg() {
    console.log(this.messageForm.value);
    console.log(this.currentBookingData);
    const body = {
      sender_id: this.user.id,
      receiver_id: this.currentBookingData.buyer,
      message: this.messageForm.controls['message'].value,
      space_id: this.currentBookingData.space_id
    };
    console.log(body);
    this.msg.sendMSG(body).then((result) => {
      console.log(result);
      if (result['status']) {
        this.messageForm.reset();
        this.modalService.dismissAll();
        this.alert.success('Message sent');
      } else {
        this.alert.error('Something went wrong');
      }
    });
  }

  // rate your renter
  rateTheRenter() {
    const body = {
      seller_id: this.user.id,
      buyer_id: this.currentBookingData.buyer,
      booking_id: this.currentBookingData.id,
      space_id: this.currentBookingData.space_id,
      rate: this.feedbackForm.controls['rating_stars'].value,
      review: this.feedbackForm.controls['feedback'].value,
    };
    console.log(body);
    this.spacesService.rateYourRenter(body).then(data => {
      console.log(data);
      if (data['status'] && data['data']) {
        this.reviewSubmitted = true;
        setTimeout(() => {
          this.modalRef.close();
          this.reviewSubmitted = false;
        }, 2000);
      } else {
        this.alert.error('Something went wrong. Try later');
      }
    });
  }


  //  get renter rating for updation
  getSubmittedRenterRating() {
    const body = {
      buyer_id: this.currentBookingData.buyer,
      booking_id: this.currentBookingData.id,
    };
    console.log(body);

    this.spacesService.getRenterRating(body).then(response => {
      console.log(response);
      if (response['status'] && response['data']) {
        this.feedbackForm.controls['feedback'].setValue(response['data']['review']);
        this.rating_stars = response['data']['rate'];
      } else if (!response['status'] && response['data']) {
        this.feedbackForm.reset();
      } else {
        this.alert.error('Something went wrong. Try later');
      }
    });
  }



  getRenterRatings() {
    const body = { buyer_id: this.currentBookingData.buyer };
    this.spacesService.getRenterRatings(body).then(response => {
      console.log(response);
      if (response['status'] && response['data'].length > 1) {
        this.renterAverageRate = response['average']['average'];
        this.totalRenterReviews = response['average']['totalrate'];
        this.renterRatingList = response['data'];
        this.buyerData = response['buyerdata'];
      } else if (response['status'] && response['data'].length === 0) {
        this.renterAverageRate = 0;
        this.totalRenterReviews = 0;
        this.renterRatingList = [];
        this.buyerData = response['buyerdata'];
      } else {
        this.alert.error('Something went wrong. Try later');
      }
    });
  }
}
