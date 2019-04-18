import { Component, OnInit, Renderer2, EventEmitter, Input, Output } from '@angular/core';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AppAlertService, SpaceService, DataService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';
import { NgbDatepickerConfig, NgbDate, NgbDateStruct, NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.css'],
})

export class CreateSpaceComponent implements OnInit {


  hoveredDate: NgbDateStruct;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;

  _datesSelected: NgbDateStruct[] = [];

  @Input()
  set datesSelected(value: NgbDateStruct[]) {
    this._datesSelected = value;
  }
  get datesSelected(): NgbDateStruct[] {
    return this._datesSelected ? this._datesSelected : [];
  }

  @Output() datesSelectedChange = new EventEmitter<NgbDateStruct[]>();



  // model;
  user: any;
  setPreview: any;
  setP: any;
  Sfill: any;
  bookmodel: NgbDate;
  spaceForm: FormGroup;
  formData = new FormData();
  not_avail = false;
  specificday = true;
  customdates = false;
  checked = false;
  isFandT: any = false;
  private SpaceTypes: any = [];
  private CapacityList: any = [];
  private AmenityList: any = [];
  private CanPolicyList: any = [];
  private StateList: any = [];
  private CityList: any = [];
  public noday: any = [];
  public nodate: any = [];
  public not_avail_ar = [];
  public blank_arr = [];
  day_from_time_required = false;
  day_to_time_required = false;
  date_from_time_required = false;
  date_to_time_required = false;
  // public week_days = [];

  week_days = [{
    id: 0,
    name: 'Sunday',
    text: 'Sun',
    selected: false
  },
  {
    id: 1,
    name: 'Monday',
    text: 'Mon',
    selected: false
  },
  {
    id: 2,
    name: 'Tuesday',
    text: 'Tue',
    selected: false
  }, {
    id: 3,
    name: 'Wednesday',
    text: 'Wed',
    selected: false
  },
  {
    id: 4,
    name: 'Thursday',
    text: 'Thur',
    selected: false
  },
  {
    id: 5,
    name: 'Friday',
    text: 'Fri',
    selected: false
  },
  {
    id: 6,
    name: 'Saturday',
    text: 'Sat',
    selected: false
  }];

  public storeCheckedAmenities: any = [];
  // public storeCheckedRules: any = [];

  daysHour: any = 0;

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: any = false;
  private files: any;
  private uploadFiles: any = [];
  public pic64data: any;

  OtherAmenityList: any = [];

  show_spinner: any = false;
  showCapacityInput: any = false;
  // showOtherAmenity: any = false;


  minDate_From: any;
  minDate_To: any;
  dateRange_From: any;
  dateRange_To: any;

  OverViewTips = 'abc';
  ImageTips = 'abc';
  AmenityTips = 'Amenity Tips goes here.';
  PricingTips = 'Pricing Tips goes here.';
  CanPolicyTips = 'Cancellation Policy Tips goes here.';
  RulesOfUseTips = 'Rules of use Tips goes here.';

  constructor(private render: Renderer2,
    private formBuilder: FormBuilder,
    private alert: AppAlertService,
    private titleService: Title,
    private dataService: DataService,
    private imgService: Ng2ImgMaxService,
    private spacesService: SpaceService,
    public calendar: NgbCalendar,
    private router: Router) {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.setPreview = localStorage.getItem('setpreview');

    this.dateRange_From = this.calendar.getToday();
    const currentDate = new Date();
    this.minDate_From = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
  }


  onDateSelection(event: any, date: NgbDateStruct) {
    // console.log(event);
    event.target.parentElement.blur();  // make that not appear the outline
    if (!this.fromDate && !this.toDate) {
      if (event.ctrlKey === true) {  // If is CrtlKey pressed
        this.fromDate = date;
      } else {
        this.addDate(date);
      }
      this.datesSelectedChange.emit(this.datesSelected);
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.addRangeDate(this.fromDate, this.toDate);
      this.fromDate = null;
      this.toDate = null;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    console.log(this.datesSelected);
    console.log(this.nodate);
  }

  addDate(date: NgbDateStruct) {
    console.log(date);
    let index = this.datesSelected.findIndex(f => f.day === date.day && f.month === date.month && f.year === date.year);
    if (index >= 0) {
      // If exist, remove the date
      this.datesSelected.splice(index, 1);
      this.nodate.splice(index, 1);
    } else {
      // a simple push
      this.datesSelected.push(date);
      this.nodate.push({ 'date': date.year + '/' + date.month + '/' + date.day, 'from': '00:00', 'to': '23:59' });
    }
  }
  addRangeDate(fromDate: NgbDateStruct, toDate: NgbDateStruct) {
    // We get the getTime() of the dates from and to
    let from = new Date(fromDate.year + '-' + fromDate.month + '-' + fromDate.day).getTime();
    let to = new Date(toDate.year + '-' + toDate.month + '-' + toDate.day).getTime();
    for (let time = from; time <= to; time += (24 * 60 * 60 * 1000)) // add one day
    {
      let date = new Date(time);
      // javascript getMonth give 0 to January, 1, to February...
      this.addDate({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
    }
    this.datesSelectedChange.emit(this.datesSelected);
  }
  // return true if is selected
  isDateSelected(date: NgbDateStruct) {
    return (this.datesSelected.findIndex(f => f.day === date.day && f.month === date.month && f.year === date.year) >= 0);
  }

  isDisabled(date: NgbDateStruct, dateRange_From, dateRange_To) {
    if (
      (
        (date.month < dateRange_From.month)
        &&
        (date.year <= dateRange_From.year)
      )
      ||
      (
        (date.day <= dateRange_From.day)
        &&
        (date.month <= dateRange_From.month)
        &&
        (date.year <= dateRange_From.year)
      )
    ) {
      return true;
    } else if (
      (
        (date.month > dateRange_To.month)
        &&
        (date.year >= dateRange_To.year)
      )
      ||
      (
        (date.day >= dateRange_To.day)
        &&
        (date.month >= dateRange_To.month)
        &&
        (date.year >= dateRange_To.year)
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);


  ngOnInit(): void {
    this.titleService.setTitle('Create your space : Lonely Spaces');
    const body = { 'user_id': this.user.id };
    this.spacesService.getCreateSpaceFormData(body).then((data) => {
      // console.log(JSON.stringify(data));
      this.SpaceTypes = data['spacetype'];
      this.CapacityList = data['capacityspace'];
      this.AmenityList = data['amenities'];
      // console.log(data['amenities']);
      this.CanPolicyList = data['cancel_policy'];
      this.StateList = data['state'];
    });

    this.spaceForm = this.formBuilder.group({
      spaceTitle: new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(50),
        Validators.required])
      ),
      spaceType: new FormControl('', Validators.required),
      spaceCapacity: new FormControl('', Validators.required),
      otherSpaceCapacity: new FormControl(''),
      inputAddress: new FormControl('', Validators.required),
      inputAddress2: new FormControl('', Validators.required),
      inputCity: new FormControl('', Validators.required),
      inputState: new FormControl('', Validators.required),
      inputZip: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(4)])),
      from_date: new FormControl('', Validators.required),
      to_date: new FormControl('', Validators.required),
      from_dateNGB: new FormControl(''),
      to_dateNGB: new FormControl(''),

      spaceDescribe: new FormControl('', Validators.compose([
        Validators.minLength(20),
        Validators.maxLength(500),
        Validators.required])
      ),

      priceType: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      minbookingdays: new FormControl('', Validators.required),
      minbookinghours: new FormControl('', Validators.required),

      cancel_policy: new FormControl('', Validators.required),
      amenity: new FormControl(''),
      otherAmenities: new FormControl(''),
      rulesOfUse: new FormControl('', Validators.compose([Validators.maxLength(500)])),
      owner_id: new FormControl(''),
      publish: new FormControl(''),
    });

    if (this.setPreview === '1') {
      localStorage.setItem('setpreview', '0');
      this.setP = this.dataService.getDataStorage();
      this.getautofill();
    }

  }

  public onDateSelect(data: NgbDateStruct, type) {
    console.log(data);
    const mydate = data.year + '-' + data.month + '-' + data.day;
    console.log(mydate);
    if (type === 'from') {
      this.spaceForm.controls['from_date'].setValue(mydate);
      this.minDate_To = { year: data.year, month: data.month, day: data.day + 1 };
      this.dateRange_From = data;
    } else {
      this.spaceForm.controls['to_date'].setValue(mydate);
      this.dateRange_To = data;
      this.isFandT = true;
    }
  }

  public add_new_date(date, date_from_time, date_to_time) {
    console.log('add_new_day');
    this.date_from_time_required = false;
    this.date_to_time_required = false;
    if (date_from_time.value == '' || date_to_time.value == '') {
      this.date_from_time_required = true;
      this.date_to_time_required = true;
      return false;
    }
    this.nodate.push({ 'date': date, 'from': date_from_time, 'to': date_to_time });
    date_from_time.value = '';
    date_to_time.value = '';
    date.value = '';

  }


  add_new_day(dayid, dayName) {
    const di = this.noday.findIndex(x => x.day === dayid);
    if (di >= 0) {
      this.noday.splice(di, 1);
    } else {
      this.noday.push({ 'day': dayid, 'daytext': dayName, 'from': '00:00', 'to': '23:59' });
    }
    console.log(this.noday);
  }


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public not_available(event: any) {
    this.not_avail = (event.target.checked) ? true : false;
  }


  public block_now(type) {
    if (type === 'specificday') {
      this.specificday = true;
      this.customdates = false;
    }
    if (type === 'customdates') {
      this.specificday = false;
      this.customdates = true;
    }

  }

  public onFileSelected(event: EventEmitter<File[]>) {
    this.files = event;
    if (this.files.length < (10 - this.uploadFiles.length)) {
      for (const droppedFile of this.files) {
        const fileExt = (droppedFile.type).split('/')[0];
        const fileSize = (droppedFile.size) / 1024;
        if (fileExt === 'image' && fileSize > 100) {                              // minimum size
          this.imgService.resize([droppedFile], 1600, 900).subscribe((result) => {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                console.log(img.width);
                console.log(img.height);
              };
              img.src = reader.result as string;
              this.pic64data = reader.result;
              this.uploadFiles.push([droppedFile.name, droppedFile.type, this.pic64data]);
            };
          });
        } else {
          this.alert.error('Please use image only of high quality');
        }
      }
    } else {
      this.alert.error('Only 9 Picture allowed!');
    }
  }
  public trashImage(index) {
    this.uploadFiles.splice(index, 1);
  }


  capacityChange(v) {
    if (v === '4') {
      this.showCapacityInput = true;
      this.spaceForm.controls['otherSpaceCapacity'].setValidators([Validators.required]);
      this.spaceForm.controls['spaceCapacity'].setErrors(null);
    } else {
      this.showCapacityInput = false;
      this.spaceForm.controls['otherSpaceCapacity'].setValue(null);
      this.spaceForm.controls['otherSpaceCapacity'].setErrors(null);
      this.spaceForm.controls['otherSpaceCapacity'].clearValidators();
    }
  }

  daysHourChange() {
    const selected = this.spaceForm.controls['priceType'].value;
    if (selected === 'day') {
      this.spaceForm.controls['minbookinghours'].setValue(null);
      this.spaceForm.controls['minbookinghours'].setErrors(null);
      this.daysHour = 0;
    } else {
      this.spaceForm.controls['minbookingdays'].setValue(null);
      this.spaceForm.controls['minbookingdays'].setErrors(null);
      this.daysHour = 1;
    }
  }


  public amenityChange(id) {
    const idx = this.storeCheckedAmenities.indexOf(id);
    if (idx !== -1) {
      this.storeCheckedAmenities.splice(idx, 1);
    } else {
      this.storeCheckedAmenities.push(id);
    }
    // otheramenities section
    // this.showOtherAmenity = (this.storeCheckedAmenities.indexOf(27) > -1) ? true : false;
    // console.log('amenityChange');

    if (this.storeCheckedAmenities.length == 0) {
      this.spaceForm.controls['amenity'].setErrors({ 'custom': true });
    } else {
      this.spaceForm.controls['amenity'].setErrors(null);
    }
  }

  addToOtherAmenityList(amenity: string) {
    if (amenity) {
      if (this.OtherAmenityList.length < 10) {
        this.OtherAmenityList.push(amenity);
        this.spaceForm.controls['otherAmenities'].reset();
      } else {
        this.alert.error('Maximum 10 allowed');
      }
    }
  }

  removeFromOtherAmenityList(amenity: string) {
    const id = this.OtherAmenityList.indexOf(amenity);
    if (id >= 0) {
      this.OtherAmenityList.splice(id, 1);
    }
  }



  submitSpace(): void {
    this.show_spinner = true;
    // const user = JSON.parse(localStorage.getItem('user'));
    this.spaceForm.controls['owner_id'].setValue(this.user.id);
    this.spaceForm.controls['otherAmenities'].setValue(this.OtherAmenityList);
    // this.spaceForm.controls['publish'].setValue(1);
    if (this.storeCheckedAmenities.length !== 0) {
      this.spaceForm.controls['amenity'].setValue(this.storeCheckedAmenities.join(','));
    }
    localStorage.setItem('modify_route', '0');
    // this.spacesService.createSpace(this.spaceForm.value, this.uploadFiles).then((data: any) => {
    //   console.log(JSON.stringify(data));
    //   if (data['success'] === 'space created successfully') {
    //     this.show_spinner = false;
    //     this.alert.success('space created!');
    //     this.router.navigate(['user-dashboard/seller-space-listing']);
    //   } else {
    //     this.show_spinner = false;
    //     this.alert.success('Something went Wrong!');
    //   }
    // });

    setTimeout(() => {
      this.show_spinner = false;
      if (this.noday.length > 0) {
        this.not_avail_ar.push(this.noday);
      } else {
        this.not_avail_ar.push(this.blank_arr);
      }

      if (this.nodate.length > 0) {
        this.not_avail_ar[1] = this.nodate;
      } else {
        this.not_avail_ar.push(this.blank_arr);
      }

      this.dataService.setDataStorage([this.spaceForm.value, this.uploadFiles, '', this.not_avail_ar]);
      this.router.navigate(['user-dashboard/review-space']);
    }, 1000);
  }

  stateChange(state_id, state_name) {
    this.spaceForm.controls['inputCity'].setValue('');
    this.spacesService.getCityList(state_id).then(data => {
      this.CityList = (data['city'][0] !== undefined) ? data['city'] : [{ id: state_id, name: state_name }];
    });
  }
  isCheck(id) {
    if (this.Sfill && this.Sfill.length > 0) {
      return this.setP[0].amenity.split(',').findIndex(item => item == id) !== -1 ? true : false
    }
  }

  getautofill() {
    if (this.setPreview === '1') {
      const body = { 'user_id': this.user.id };
      this.spacesService.getCreateSpaceFormData(body).then((data) => {
        let test = data['state'].find(chunk => chunk.id == this.Sfill[0].inputState);
        this.stateChange(test.id, test.name);
        this.spaceForm.controls['inputCity'].setValue(this.Sfill[0].inputCity);

      });
      this.Sfill = this.setP;
      console.log(this.Sfill);


      this.spaceForm.controls['spaceTitle'].setValue(this.Sfill[0].spaceTitle);
      this.spaceForm.controls['spaceType'].setValue(this.Sfill[0].spaceType);
      this.spaceForm.controls['spaceCapacity'].setValue(this.Sfill[0].spaceCapacity);
      this.spaceForm.controls['otherSpaceCapacity'].setValue(this.Sfill[0].otherSpaceCapacity);
      this.showCapacityInput = (this.Sfill[0].spaceCapacity === '4') ? true : false;
      this.spaceForm.controls['spaceDescribe'].setValue(this.Sfill[0].spaceDescribe);
      this.spaceForm.controls['inputAddress'].setValue(this.Sfill[0].inputAddress);
      this.spaceForm.controls['inputAddress2'].setValue(this.Sfill[0].inputAddress2);
      this.spaceForm.controls['inputState'].setValue(this.Sfill[0].inputState);
      this.spaceForm.controls['inputCity'].setValue(this.Sfill[0].inputCity);
      this.spaceForm.controls['inputZip'].setValue(this.Sfill[0].inputZip);
      this.spaceForm.controls['from_date'].setValue(this.Sfill[0].from_date);
      this.spaceForm.controls['to_date'].setValue(this.Sfill[0].to_date);


      this.spaceForm.controls['from_dateNGB'].setValue(this.Sfill[0].from_dateNGB);
      this.spaceForm.controls['to_dateNGB'].setValue(this.Sfill[0].to_dateNGB);

      this.dateRange_To = this.spaceForm.controls['to_dateNGB'].value;

      this.uploadFiles = this.Sfill[1];
      this.isFandT = true;

      this.not_avail_ar = this.Sfill[3];
      console.log(this.not_avail_ar);
      this.nodate = this.not_avail_ar[1] || [];
      this.noday = this.not_avail_ar[0] || [];
      console.log('9999999999999999999999');
      console.log(this.noday);
      console.log('9999999999999999999999');


      for (let index = 0; index < this.nodate.length; index++) {
        const element = this.nodate[index];
        var dtd = new Date(element['date']);

        var yy = dtd.getFullYear();
        var mm = dtd.getMonth();
        var dd = dtd.getDate();
        var dt = { 'year': yy, 'month': mm + 1, 'day': dd };
        this.datesSelected.push(dt);
      }
      console.log(this.datesSelected);

      if (this.nodate.length > 0 || this.noday.length > 0) {
        this.checked = true;
        this.not_avail = true;
      }

      if (this.noday.length > 0) {
        this.noday.forEach(day => {
          //this.week_days = this.week_days.filter(wday => wday.id !== day.day);
          let index = this.week_days.findIndex(f => f.id == day.day);
          this.week_days[index].selected = true;
        });
      }

      //this.spaceForm.controls['amenity'].setValue(this.Sfill[0].amenity);
      this.spaceForm.controls['otherAmenities'].setValue('');

      this.spaceForm.controls['priceType'].setValue(this.Sfill[0].priceType);
      this.spaceForm.controls['price'].setValue(this.Sfill[0].price);
      // this.spaceForm.controls['minbookingdays'].setValue(this.Sfill[0].minbookingdays);
      // this.spaceForm.controls['minbookinghours'].setValue(this.Sfill[0].minbookinghours);
      this.spaceForm.controls['rulesOfUse'].setValue(this.Sfill[0].rulesOfUse);
      this.spaceForm.controls['cancel_policy'].setValue(this.Sfill[0].cancel_policy);
      this.storeCheckedAmenities = this.setP[0].amenity.split(',').map(Number);
      //   this.storeCheckedAmenities = this.setP[0].amenity.split.split(',').map(function(item) {
      //     return parseInt(item, 10);
      // });
      this.OtherAmenityList = this.Sfill[0].otherAmenities;
      const selected = this.spaceForm.controls['priceType'].value;

      if (selected === 'day') {
        this.spaceForm.controls['minbookingdays'].setValue(this.Sfill[0].minbookingdays);
        this.spaceForm.controls['minbookinghours'].setValue(null);
        this.spaceForm.controls['minbookinghours'].setErrors(null);
        this.spaceForm.controls['minbookinghours'].clearValidators();
        this.daysHour = 0;
      } else {
        this.spaceForm.controls['minbookinghours'].setValue(this.Sfill[0].minbookinghours);
        this.spaceForm.controls['minbookingdays'].setValue(null);
        this.spaceForm.controls['minbookingdays'].setErrors(null);
        this.spaceForm.controls['minbookingdays'].clearValidators();

        this.daysHour = 1;
      }

      console.log(this.spaceForm.get('spaceTitle').valid);
      console.log(this.spaceForm.get('spaceType').valid);
      console.log(this.spaceForm.get('spaceCapacity').valid);
      console.log(this.spaceForm.get('spaceDescribe').valid);
      console.log(this.spaceForm.get('inputAddress').valid);
      console.log(this.spaceForm.get('inputAddress2').valid);
      console.log(this.spaceForm.get('inputState').valid);
      console.log(this.spaceForm.get('inputZip').valid);
      console.log(this.spaceForm.get('from_date').valid);
      console.log(this.spaceForm.get('to_date').valid);
      console.log(this.spaceForm.get('cancel_policy').valid);

      console.log(this.spaceForm.get('minbookinghours').valid);
      console.log(this.spaceForm.get('minbookingdays').valid);
      console.log(this.spaceForm.get('price').valid);
      console.log(this.spaceForm.get('priceType').valid);
    }
  }
}