import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { UserService, SpaceService, DataService } from '../_services';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { DateRange, DateRangePickerModule } from '@uiowa/date-range-picker';
import { element } from '@angular/core/src/render3/instructions';
import { log } from 'util';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit, OnDestroy {

  spaceID: any;
  spaceDetails: any;
  spaceNoAvail: any;
  spaceBookings: any;
  noday: any = [];
  nodate: any = [];
  user: any;
  datePickerForm: FormGroup;
  tmindate: any;
  tmaxdate: any;
  fmindate: any;
  fmaxdate: any;
  space_fdate: any;
  space_tdate: any;
  disabled: any = false;
  fdisabled: any = false;
  disabl_hours: any = [];
  public hrar = [];
  err = '';
  succes = '';
  space_disable: any = [];
  public fhours: any = [];

  public thours: any = [];

  ftimeformt: any = { 'id': 0, 'value': 'AM' };
  ttimeformt: any = { 'id': 0, 'value': 'AM' };

  SimilarSpaces: any;
  ReviewData: any;
  picURL = environment.picURL;

  constructor(private router: Router,
    private userService: UserService,
    private spacesService: SpaceService,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    private dataService: DataService,
    private _route: ActivatedRoute) {
    this.user = this.userService.getUserData() || [];
    const spaceDetail = JSON.parse(localStorage.getItem('spaceDetails'));
    this.spaceDetails = spaceDetail[0];
    this.spaceNoAvail = spaceDetail[1];
    this.spaceBookings = spaceDetail[2];
    if (this.spaceNoAvail.length > 1) {
      this.nodate = this.spaceNoAvail[1];
      this.noday = this.spaceNoAvail[0];
    }
    if (this.spaceNoAvail.length == 1) {
      this.noday = this.spaceNoAvail[0];
    }
    for (let index = 0; index < 24; index++) {
      var i = (index < 10) ? '0' + index.toString() : index.toString()
      var j = (index < 9) ? '0' + (index + 1).toString() : (index + 1).toString()
      this.fhours.push({ id: index, value: i + ':00', 'disabled': false })
      this.thours.push({ id: index, value: j + ':00', 'disabled': false })
    }

    this.space_fdate = new Date(this.spaceDetails.from_date);
    this.space_tdate = new Date(this.spaceDetails.to_date);
    var today = new Date();
    // console.log(today);
    console.log(this.spaceBookings, this.nodate);
    // console.log(this.space_fdate);
    // console.log(today.getMonth()+1);



    if (this.space_tdate > today) {
      // console.log('date true')
      if (this.space_fdate < today) {
        this.tmindate = { 'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate() }
        this.fmindate = { 'year': today.getFullYear(), 'month': today.getMonth() + 1, 'day': today.getDate() }
      } else {
        this.tmindate = { 'year': this.space_fdate.getFullYear(), 'month': this.space_fdate.getMonth() + 1, 'day': this.space_fdate.getDate() }
        this.fmindate = { 'year': this.space_fdate.getFullYear(), 'month': this.space_fdate.getMonth() + 1, 'day': this.space_fdate.getDate() }
      }

      this.tmaxdate = { 'year': this.space_tdate.getFullYear(), 'month': this.space_tdate.getMonth() + 1, 'day': this.space_tdate.getDate() }
      this.fmaxdate = { 'year': this.space_tdate.getFullYear(), 'month': this.space_tdate.getMonth() + 1, 'day': this.space_tdate.getDate() }

    } else {
      // console.log('date false')
      this.disabled = true;
      this.fdisabled = true;
      this.err = 'Booking not Available, All dates are booked';
    }



  }
  isDisabled = (date: NgbDate) => {
    var ddt = false;

    if (this.noday.length > 0) {
      var ft;

      this.noday.findIndex(f => {
        if (f.day == 0) {
          const dd = 7;
          ft = (dd == this.calendar.getWeekday(date));
        } else {
          ft = (f.day == this.calendar.getWeekday(date));
        }
        if (ft) {
          ddt = true;
          let index = this.space_disable.findIndex(f => f.year == date.year && f.month == date.month && f.day == date.day);
          if (index < 0) {
            this.space_disable.push(date);
          }

        }
      });
      if (ddt) { return true; }
    }
    if (this.nodate.length > 0) {
      var ft;
      this.nodate.sort((a, b) => a.date.localeCompare(b.date));
      this.nodate.findIndex(f => {
        var dd = (date.day < 10) ? '0' + date.day.toString() : date.day.toString();
        var mm = ((date.month) < 10) ? '0' + (date.month).toString() : (date.month).toString();

        if (f.date == date.year + "-" + mm + "-" + dd) {
          ft = true;
        }
        if (ft) {
          ddt = true;
          let index = this.space_disable.findIndex(f => f.year == date.year && f.month == date.month && f.day == date.day);
          if (index < 0) {
            this.space_disable.push(date);
          }
        }
      });
      if (ddt) { return true; }
    }
    if (this.spaceBookings.length > 0) {
      var ft;
      this.spaceBookings.sort((a, b) => a.from_date.localeCompare(b.from_date));
      this.hrar = [];
      this.spaceBookings.findIndex(f => {

        var dd = (date.day < 10) ? '0' + date.day.toString() : date.day.toString();
        var mm = ((date.month) < 10) ? '0' + (date.month).toString() : (date.month).toString();
        var bk_fdt = new Date(f.from_date);
        var bk_tdt = new Date(f.to_date);
        var bk_dt = new Date(date.year + "-" + mm + "-" + dd);
        if ((bk_fdt < bk_dt) && (bk_dt < bk_tdt)) {
          ft = true;
        }
        if (bk_fdt.getFullYear() == bk_dt.getFullYear() && bk_fdt.getMonth() == bk_dt.getMonth() && bk_dt.getDate() == bk_fdt.getDate()) {
          ft = false;
          if (bk_tdt.getFullYear() == bk_dt.getFullYear() && bk_tdt.getMonth() == bk_dt.getMonth() && bk_dt.getDate() == bk_tdt.getDate()) {
            this.hrar.push({ 'from': bk_fdt.getHours(), 'to': bk_tdt.getHours() });
            var m = bk_fdt.getMonth() + 1;
            this.disabl_hours['"' + bk_fdt.getFullYear() + '/' + m + '/' + bk_fdt.getDate() + '"'] = this.hrar;
          } else {
            this.hrar.push({ 'from': bk_fdt.getHours(), 'to': 23 });
            var m = bk_fdt.getMonth() + 1;
            this.disabl_hours['"' + bk_fdt.getFullYear() + '/' + m + '/' + bk_fdt.getDate() + '"'] = this.hrar;
          }
        }
        if (bk_tdt.getFullYear() == bk_dt.getFullYear() && bk_tdt.getMonth() == bk_dt.getMonth() && bk_dt.getDate() == bk_tdt.getDate()) {
          ft = false;


          if (bk_fdt.getFullYear() == bk_dt.getFullYear() && bk_fdt.getMonth() == bk_dt.getMonth() && bk_dt.getDate() == bk_fdt.getDate()) {

            // var hrar = {'from':bk_fdt.getHours(),'to':bk_tdt.getHours()};
            // var m = bk_fdt.getMonth()+1;
            // this.disabl_hours['"'+bk_fdt.getFullYear()+'/'+m+'/'+bk_fdt.getDate()+'"']=hrar;
          } else {
            this.hrar.push({ 'from': 0, 'to': bk_tdt.getHours() });
            var m = bk_tdt.getMonth() + 1;
            this.disabl_hours['"' + bk_tdt.getFullYear() + '/' + m + '/' + bk_tdt.getDate() + '"'] = this.hrar;
          }
        }
        // console.log('disabl hours',this.disabl_hours);

        if (ft) {
          ddt = true;
          let index = this.space_disable.findIndex(f => f.year == date.year && f.month == date.month && f.day == date.day);
          if (index < 0) {
            this.space_disable.push(date);
          }
        }
      });
      if (ddt) { return true; }
    }
    return false;
  };
  isDisabledt = (date: NgbDate) => {
    var ddt = false;
    if (this.noday.length > 0) {
      var ft;
      this.noday.findIndex(f => {
        if (f.day == 0) {
          const dd = 7;
          ft = (dd == this.calendar.getWeekday(date));
        } else {
          ft = (f.day == this.calendar.getWeekday(date));
        }
        if (ft) { ddt = true; }
      });
      if (ddt) { return true; }
    }
    if (this.nodate.length > 0) {
      var ft;

      this.nodate.findIndex(f => {
        var dd = (date.day < 10) ? '0' + date.day.toString() : date.day.toString();
        var mm = ((date.month) < 10) ? '0' + (date.month).toString() : (date.month).toString();
        //  console.log(f.date);
        //  console.log(date.year+"-"+mm+"-"+dd);

        if (f.date == date.year + "-" + mm + "-" + dd) {
          ft = true;
        }
        if (ft) { ddt = true; }
      });
      if (ddt) { return true; }
    }
    return false;
  };
  ngOnInit() {

    this._route.queryParams.subscribe(params => { this.spaceID = params['spaceID']; });
    // console.log(this.spaceID);
    this.datePickerForm = this.formBuilder.group({
      // from_datengb: new FormControl(''),
      // to_datengb: new FormControl(''),
      from_time: new FormControl('', Validators.compose([Validators.required])),
      to_time: new FormControl('', Validators.compose([Validators.required])),
      buyer_id: new FormControl(this.user.id),
      from_date: new FormControl('', Validators.required),
      to_date: new FormControl('', Validators.required),
      ftimefrmt: new FormControl(0),
      ttimefrmt: new FormControl(0),
      seller_id: new FormControl(this.spaceDetails.owner_id),
      space_id: new FormControl(this.spaceDetails.id)
    });

    this.spacesService.getExtraInfoOnBookingPage({ space_id: this.spaceID }).then((result) => {
      console.log(result);
      if (result['status']) {
        this.SimilarSpaces = result['space'];
        this.ReviewData = result['data'];
      }
    });
  }
  onfDateSelect(fdate: NgbDate) {
    this.tmindate = fdate;

    // const mydate = fdate.year+'-'+fdate.month+'-'+fdate.day;
    console.log(this.disabl_hours);
    for (let index = 0; index < 24; index++) {
      this.fhours[index].disabled = false;
    }
    if (this.disabl_hours['"' + fdate.year + '/' + fdate.month + '/' + fdate.day + '"']) {
      var hrarr = this.disabl_hours['"' + fdate.year + '/' + fdate.month + '/' + fdate.day + '"'];
      console.log(hrarr);

      hrarr.forEach(element => {
        for (let index = element.from; index <= element.to; index++) {
          this.fhours[index].disabled = true;
        }
      });
    }

    this.datePickerForm.controls['to_date'].setValue('');
    this.datePickerForm.controls['from_time'].setValue('');


    var fdt = new Date(fdate.year + '/' + fdate.month + '/' + fdate.day);
    var dhr = this.spaceDetails.min_hrs == 0 ? this.spaceDetails.min_no_of_days : this.spaceDetails.min_hrs
    var newdate = new Date(fdt);
    var mindtar = [];
    if (this.spaceDetails.pricehr == 'day') {

      this.tmindate = { 'year': newdate.getFullYear(), 'month': newdate.getMonth() + 1, 'day': newdate.getDate() };
      for (let index = 0; index < parseInt(dhr); index++) {
        let i = this.space_disable.findIndex(f => f.day == newdate.getDate() && f.month == newdate.getMonth() + 1 && f.year == newdate.getFullYear());
        if (i >= 0) {
          mindtar.push(i);
        }
        newdate.setDate(newdate.getDate() + 1);
      }

    } else {
      newdate.setHours(newdate.getHours() + parseInt(dhr));
    }
    if (this.space_tdate < newdate) {
      this.disabled = true;
      this.err = 'please select any other date';
    } else {
      this.disabled = false;
      this.err = '';
      if (this.spaceDetails.pricehr == 'day') {
        newdate.setDate(newdate.getDate() - 1);
        this.tmindate = { 'year': newdate.getFullYear(), 'month': newdate.getMonth() + 1, 'day': newdate.getDate() };
      } else {
        this.tmindate = { 'year': newdate.getFullYear(), 'month': newdate.getMonth() + 1, 'day': newdate.getDate() };
      }

    }


    if (mindtar.length > 0) {
      this.disabled = true;
      this.err = 'please select any other date';
    } else {
      this.disabled = false;
      this.err = '';
      let index = this.space_disable.findIndex(f => {
        var fdt = new Date(f.year + '/' + f.month + '/' + f.day);
        if (fdt > newdate) {
          return true;
        }

      }
      );
      if (index >= 0) {
        this.tmaxdate = { 'year': this.space_disable[index].year, 'month': this.space_disable[index].month, 'day': this.space_disable[index].day };
      } else {
        this.tmaxdate = { 'year': this.space_tdate.getFullYear(), 'month': this.space_tdate.getMonth() + 1, 'day': this.space_tdate.getDate() }
      }
    }
    console.log(this.tmindate, this.tmaxdate);

  }

  ftimenow(tf, hrs) {

    if (tf.value == 0) {
      // for (let index = 0; index < hrs.options.length; index++) {
      //     hrs.options[index].value = parseInt(hrs.options[index].value) + 12;        
      // }   
      this.ftimeformt = { 'id': 1, 'value': 'PM' }
      this.datePickerForm.controls['ftimefrmt'].setValue(1);
    } else {
      // for (let index = 0; index < hrs.options.length; index++) {
      //     hrs.options[index].value = parseInt(hrs.options[index].value) - 12;        
      // }
      this.datePickerForm.controls['ftimefrmt'].setValue(0);
      this.ftimeformt = { 'id': 0, 'value': 'AM' }
    }
  }
  ttimenow(tf, hrs) {
    if (tf.value == 0) {
      // for (let index = 0; index < hrs.options.length; index++) {
      //     hrs.options[index].value = parseInt(hrs.options[index].value) + 12;        
      // } 
      this.ttimeformt = { 'id': 1, 'value': 'PM' }
      this.datePickerForm.controls['ttimefrmt'].setValue(1);
    } else {
      // for (let index = 0; index < hrs.options.length; index++) {
      //     hrs.options[index].value = parseInt(hrs.options[index].value) - 12;        
      // }
      this.ttimeformt = { 'id': 0, 'value': 'AM' }
      this.datePickerForm.controls['ttimefrmt'].setValue(0);
    }
  }

  goodtogo() {
    console.log(this.datePickerForm.value);
    var f_date = this.datePickerForm.value.from_date;
    var t_date = this.datePickerForm.value.to_date;
    var ftime = (this.datePickerForm.value.ftimefrmt == 1) ? (parseInt(this.datePickerForm.value.from_time) + 12) : this.datePickerForm.value.from_time;
    var ttime = (this.datePickerForm.value.ttimefrmt == 1) ? (parseInt(this.datePickerForm.value.to_time) + 12) : this.datePickerForm.value.to_time
    var data = {
      "buyer_id": this.datePickerForm.value.buyer_id,
      "seller_id": this.datePickerForm.value.seller_id,
      "space_id": this.datePickerForm.value.space_id,
      "from_date": f_date.year + '-' + f_date.month + '-' + f_date.day + ' ' + ftime + ':00',
      "to_date": t_date.year + '-' + t_date.month + '-' + t_date.day + ' ' + ttime + ':59',
      "from_time": ftime + ':00',
      "to_time": ttime + ':59',
    };
    this.spacesService.book_space(data).then((response) => {
      if (response['status'] == true) {
        this.datePickerForm.reset;
        this.err = '';
        this.succes = 'space booking successfull';
        setTimeout(() => {
          this.router.navigate(['user-dashboard/reservations']);
        }, 500);

      } else {
        this.err = response['data'];
        console.log('----------------------');
        console.log(response['data']);
        console.log('----------------------');
        this.succes = '';
      }
    });
  }

  inputFromDate(e) {
    // console.log('hello');
    // console.log(e);
  }

  ngOnDestroy() {
    // localStorage.removeItem('spaceDetails');
  }


  viewReviews() {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': this.spaceID }
    };
    this.router.navigate(['space-reviews'], navigationExtras);
  }

   // view space in same page
   viewSpace(spaceID) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': spaceID }
    };
    this.router.navigate(['space-detail'], navigationExtras);
  }


}

