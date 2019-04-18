import { Component, OnInit, EventEmitter, OnDestroy, Input, Output } from '@angular/core';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropModule, UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AppAlertService, SpaceService, DataService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { NgbCalendar, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


@Component({
  selector: 'app-modify-space',
  templateUrl: './modify-space.component.html',
  styleUrls: ['./modify-space.component.css'],
})
export class ModifySpaceComponent implements OnInit, OnDestroy {
  user: any;
  spaceID: any;
  setPreview: any;
  setP: any;
  Sfill: any;
  spaceToModify: any = [];
  spaceRes: any = [];
  spaceForm: FormGroup;

  public storeCheckedAmenities: any = [];

  public publish: any = 0;
  public createSpaceAllData;

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: any = false;
  private files: any;
  private uploadFiles: any = [];
  public pic64data: any;

  OtherAmenityList: any = [];

  picURL = environment.picURL;
  inComingFiles: any = [];
  inComingFilesURL: any = [];
  truncatedImages: any = [];

  daysData: any = 0;
  show_save_spinner: any = false;
  show_publish_spinner: any = false;
  // showOtherAmenity: any = false;
  showCapacityInput: any = false;
  show_spinner: any = false;
  not_avail = false;
  specificday = true;
  customdates = false;
  checked = false;
  isFandT: any = true;
  isNotAvailableCheck: any = false;


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

  week_days = [
    {
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
    }
  ];


  OverViewTips = 'A clear descrind promote your space.';
  ImageTips = 'This is youquality photosour space has to offer.';
  AmenityTips = 'Amenity Tips goes here.';
  PricingTips = 'Pricing Tips goes here.';
  CanPolicyTips = 'Cancellation Policy Tips goes here.';
  RulesOfUseTips = 'Rules of use Tips';


  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct

  minDate_From: any;
  minDate_To: any;
  dateRange_From: any;
  dateRange_To: any;
  ngbFromDate: any;
  ngbToDate: any;


  _datesSelected: NgbDateStruct[] = [];

  @Input()
  set datesSelected(value: NgbDateStruct[]) {
    this._datesSelected = value;
  }
  get datesSelected(): NgbDateStruct[] {
    return this._datesSelected ? this._datesSelected : [];
  }

  @Output() datesSelectedChange = new EventEmitter<NgbDateStruct[]>();


  constructor(private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alert: AppAlertService,
    private spacesService: SpaceService,
    private imgService: Ng2ImgMaxService,
    private titleService: Title,
    private parserFormatter: NgbDateParserFormatter,
    private dataService: DataService,
    private router: Router,
    public calendar: NgbCalendar) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.dateRange_From = this.calendar.getToday();
    const currentDate = new Date();
    this.minDate_From = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    this.minDate_To = { year: this.minDate_From.year, month: this.minDate_From.month, day: this.minDate_From.day + 1 };
  }


  ngOnInit(): void {
    this.titleService.setTitle('Modify your space : Lonely Spaces');
    this.setPreview = JSON.parse(localStorage.getItem('setpreview'));

    this._route.queryParams.subscribe(params => {
      this.spaceID = params['spaceID'];
    });

    if (this.setPreview === 1) {
      console.log('local storage');
      localStorage.setItem('setpreview', '0');
      this.setP = this.dataService.getDataStorage();
      this.spaceToModify = this.setP[0];

      this.storeCheckedAmenities = this.spaceToModify.amenity.split(',').map((el: any) => {
        const n = Number(el);
        return n === 0 ? n : n || el;
      });
      this.uploadFiles = this.setP[1];
      this.inComingFiles = this.setP[2];
      this.not_avail_ar = this.setP[3];

      let rangeTo = new Date(this.spaceToModify['to_date']);
      this.dateRange_To = { 'year': rangeTo.getFullYear(), 'month': rangeTo.getMonth() + 1, 'day': rangeTo.getDate() };

      this.noday = this.not_avail_ar[0] || [];
      this.nodate = this.not_avail_ar[1] || [];

      this.isNotAvailableCheck = (this.not_avail_ar.length > 0) ? true : false;
      this.not_avail = (this.isNotAvailableCheck) ? true : false;

      if (this.noday.length > 0) {
        this.noday.forEach((day: any) => {
          const index = this.week_days.findIndex(w => w.id === Number(day.day));
          this.week_days[index].selected = true;
        });
      }

      if (this.nodate.length > 0) {
        for (let index = 0; index < this.nodate.length; index++) {
          const element = this.nodate[index];
          var dt = new Date(element['date']);
          var dx = { 'year': dt.getFullYear(), 'month': dt.getMonth() + 1, 'day': dt.getDate() };
          this.datesSelected.push(dx);
        }
      }
      this.runLater_rv();
    } else {
      console.log('APIcall');
      this.spacesService.getModifySpaceData(this.user.id, this.spaceID).then((response) => {
        console.log(JSON.stringify(response));
        if (response['status']) {
          this.spaceToModify = response['data'];

          let rangeTo = new Date(this.spaceToModify['to_date']);
          this.dateRange_To = { 'year': rangeTo.getFullYear(), 'month': rangeTo.getMonth() + 1, 'day': rangeTo.getDate() };

          this.not_avail_ar = response['day_date'];
          this.noday = this.not_avail_ar[0] || [];
          this.nodate = this.not_avail_ar[1] || [];

          this.isNotAvailableCheck = (this.not_avail_ar.length > 0) ? true : false;
          this.not_avail = (this.isNotAvailableCheck) ? true : false;

          if (this.noday.length > 0) {
            this.noday.forEach((day: any) => {
              const index = this.week_days.findIndex(w => w.id === Number(day.day));
              this.week_days[index].selected = true;
            });
          }

          if (this.nodate.length > 0) {
            for (let index = 0; index < this.nodate.length; index++) {
              const element = this.nodate[index];
              var dt = new Date(element['date']);
              var dx = { 'year': dt.getFullYear(), 'month': dt.getMonth() + 1, 'day': dt.getDate() };
              this.datesSelected.push(dx);
            }
          }

          this.storeCheckedAmenities = this.spaceToModify.amenities_id.split(',').map((el: any) => {
            const n = Number(el);
            return n === 0 ? n : n || el;
          });
          this.inComingFiles = this.spaceToModify.picture.split(',');
          this.runLater();
        }
      });
    }
  }


  public onDateSelect(data: NgbDateStruct, type: any) {
    const mydate = data.year + '-' + data.month + '-' + data.day;
    if (type === 'from') {
      console.log('from');

      this.spaceForm.controls['from_date'].setValue(mydate);
      this.dateRange_From = data;
      this.minDate_To = { year: data.year, month: data.month, day: data.day + 1 };
    } else {
      console.log('toooooo');

      this.spaceForm.controls['to_date'].setValue(mydate);
      this.dateRange_To = data;
    }
  }

  public not_available(event: any) {
    this.not_avail = (event.target.checked) ? true : false;
  }

  add_new_day(dayID: any, dayName: any) {
    const di = this.noday.findIndex(x => Number(x.day) === dayID);
    if (di >= 0) {
      this.noday.splice(di, 1);
    } else {
      this.noday.push({ 'day': dayID, 'daytext': dayName, 'from': '00:00', 'to': '23:59' });
    }
    console.log(this.noday);
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  isDateSelected(date: NgbDateStruct) {
    return (this.datesSelected.findIndex(f => f.day === date.day && f.month === date.month && f.year === date.year) >= 0);
  }

  isDisabled(date: NgbDateStruct) {
    if (
      (
        (date.month < this.dateRange_From.month)
        &&
        (date.year <= this.dateRange_From.year)
      )
      ||
      (
        (date.day <= this.dateRange_From.day)
        &&
        (date.month <= this.dateRange_From.month)
        &&
        (date.year <= this.dateRange_From.year)
      )
    ) {
      return true;
    } else if (
      (
        (date.month > this.dateRange_To.month)
        &&
        (date.year >= this.dateRange_To.year)
      )
      ||
      (
        (date.day >= this.dateRange_To.day)
        &&
        (date.month >= this.dateRange_To.month)
        &&
        (date.year >= this.dateRange_To.year)
      )
    ) {
      return true;
    } else {
      return false;
    }
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

  runLater() {
    this.spaceForm = this.formBuilder.group({
      spaceTitle: new FormControl(this.spaceToModify.title, Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(50),
        Validators.required])
      ),
      spaceType: new FormControl(this.spaceToModify.space_type, Validators.required),
      spaceCapacity: new FormControl(this.spaceToModify.capacity_of_space, Validators.required),
      otherSpaceCapacity: new FormControl(this.spaceToModify.otherspacecapacity, Validators.required),

      inputAddress: new FormControl(this.spaceToModify.address1, Validators.required),
      inputAddress2: new FormControl(this.spaceToModify.address2, Validators.required),
      inputCity: new FormControl(this.spaceToModify.city, Validators.required),
      inputState: new FormControl(this.spaceToModify.state, Validators.required),
      inputZip: new FormControl(this.spaceToModify.postcode, Validators.compose([Validators.required, Validators.maxLength(4)])),
      from_date: new FormControl(this.spaceToModify.from_date, Validators.required),
      to_date: new FormControl(this.spaceToModify.to_date, Validators.required),
      // from_dateNGB: new FormControl(''),
      // to_dateNGB: new FormControl(''),
      spaceDescribe: new FormControl(this.spaceToModify.overview, Validators.required),
      priceType: new FormControl(this.spaceToModify.pricehr, Validators.required),
      price: new FormControl(this.spaceToModify.pricerate, Validators.required),
      minbookingdays: new FormControl(this.spaceToModify.min_no_of_days, Validators.required),
      minbookinghours: new FormControl(this.spaceToModify.min_hrs, Validators.required),
      cancel_policy: new FormControl(this.spaceToModify.cancel_policy, Validators.required),
      amenity: new FormControl(''),
      otherAmenities: new FormControl(this.spaceToModify.otheramenities),
      owner_id: new FormControl(''),
      rulesOfUse: new FormControl(this.spaceToModify.rulesofuse, Validators.compose([Validators.maxLength(500)])),
      publish: new FormControl(''),
      spaceId: new FormControl(this.spaceToModify.id),
    });

    this.setNGB_To_From_Dates(this.spaceToModify.from_date, this.spaceToModify.to_date);

    const body = { 'user_id': this.user.id };
    this.spacesService.getCreateSpaceFormData(body).then((data) => {
      // console.log(JSON.stringify(data));
      this.SpaceTypes = data['spacetype'];
      this.CapacityList = data['capacityspace'];
      this.AmenityList = data['amenities'];
      this.CanPolicyList = data['cancel_policy'];
      this.StateList = data['state'];
      this.setCity(this.spaceToModify.state);
    });

    // check if days/hour booking
    this.daysData = (this.spaceToModify.min_no_of_days === '0') ? 0 : 1;


    if (this.spaceToModify.otherspacecapacity) {
      this.showCapacityInput = true;
      this.spaceForm.controls['spaceCapacity'].setErrors(null);
    } else {
      this.showCapacityInput = false;
      this.spaceForm.controls['otherSpaceCapacity'].setErrors(null);
      this.spaceForm.controls['otherSpaceCapacity'].clearValidators();
    }
  }

  setNGB_To_From_Dates(fromDate: any, ToDate: any) {
    let fd = new Date(fromDate);
    let td = new Date(ToDate);

    // this.spaceForm.controls['from_dateNGB'].setValue({ 'year': fd.getFullYear(), 'month': fd.getMonth() + 1, 'day': fd.getDate() });
    // this.spaceForm.controls['to_dateNGB'].setValue({ 'year': td.getFullYear(), 'month': td.getMonth() + 1, 'day': td.getDate() });

    this.ngbFromDate = fd.getMonth() + 1 + '/' + fd.getDate() + '/' + fd.getFullYear();
    this.ngbToDate = td.getMonth() + 1 + '/' + td.getDate() + '/' + td.getFullYear();
  }

  runLater_rv() {
    this.spaceForm = this.formBuilder.group({
      spaceTitle: new FormControl(this.spaceToModify.spaceTitle, Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(50),
        Validators.required])
      ),
      spaceType: new FormControl(this.spaceToModify.spaceType, Validators.required),
      spaceCapacity: new FormControl(this.spaceToModify.spaceCapacity, Validators.required),
      otherSpaceCapacity: new FormControl(this.spaceToModify.otherSpaceCapacity),

      inputAddress: new FormControl(this.spaceToModify.inputAddress, Validators.required),
      inputAddress2: new FormControl(this.spaceToModify.inputAddress2, Validators.required),
      inputCity: new FormControl(this.spaceToModify.inputCity, Validators.required),
      inputState: new FormControl(this.spaceToModify.inputState, Validators.required),
      inputZip: new FormControl(this.spaceToModify.inputZip, Validators.compose([Validators.required, Validators.maxLength(4)])),
      from_date: new FormControl(this.spaceToModify.from_date, Validators.required),
      to_date: new FormControl(this.spaceToModify.to_date, Validators.required),
      spaceDescribe: new FormControl(this.spaceToModify.spaceDescribe, Validators.required),
      priceType: new FormControl(this.spaceToModify.priceType, Validators.required),
      price: new FormControl(this.spaceToModify.price, Validators.required),
      minbookingdays: new FormControl(this.spaceToModify.minbookingdays, Validators.required),
      minbookinghours: new FormControl(this.spaceToModify.minbookinghours, Validators.required),
      cancel_policy: new FormControl(this.spaceToModify.cancel_policy, Validators.required),
      amenity: new FormControl(''),
      otherAmenities: new FormControl(),
      owner_id: new FormControl(''),
      rulesOfUse: new FormControl(this.spaceToModify.rulesOfUse, Validators.compose([Validators.maxLength(500)])),
      publish: new FormControl(''),
      spaceId: new FormControl(this.spaceToModify.spaceId),
    });
    this.OtherAmenityList = this.spaceToModify.otherAmenities;

    const body = { 'user_id': this.user.id };
    this.spacesService.getCreateSpaceFormData(body).then((data) => {
      // console.log(JSON.stringify(data));
      this.SpaceTypes = data['spacetype'];
      this.CapacityList = data['capacityspace'];
      this.AmenityList = data['amenities'];
      this.CanPolicyList = data['cancel_policy'];
      this.StateList = data['state'];
      this.setCity(this.spaceToModify.inputState);
    });

    // check if days/hour booking
    this.daysData = (this.spaceToModify.min_no_of_days === '0') ? 0 : 1;
    this.setNGB_To_From_Dates(this.spaceToModify.from_date, this.spaceToModify.to_date);


    if (this.spaceToModify.otherSpaceCapacity) {
      this.showCapacityInput = true;
      this.spaceForm.controls['spaceCapacity'].setErrors(null);
      this.spaceForm.controls['otherSpaceCapacity'].setValidators([Validators.required]);
    } else {
      this.showCapacityInput = false;
      this.spaceForm.controls['otherSpaceCapacity'].setErrors(null);
      this.spaceForm.controls['otherSpaceCapacity'].clearValidators();
    }

    const selected2 = this.spaceForm.controls['priceType'].value;

    if (selected2 === 'day') {
      this.spaceForm.controls['minbookingdays'].setValue(this.spaceToModify.minbookingdays);
      this.spaceForm.controls['minbookinghours'].setValue(null);
      this.spaceForm.controls['minbookinghours'].setErrors(null);
      this.spaceForm.controls['minbookinghours'].clearValidators();
      this.daysData = 1;
    } else {
      this.spaceForm.controls['minbookinghours'].setValue(this.spaceToModify.minbookinghours);
      this.spaceForm.controls['minbookingdays'].setValue(null);
      this.spaceForm.controls['minbookingdays'].setErrors(null);
      this.spaceForm.controls['minbookingdays'].clearValidators();
      this.daysData = 0;
    }
  }
  public onFileSelected(event: EventEmitter<File[]>) {
    this.files = event;
    if (this.files.length < (10 - (this.inComingFiles.length + this.uploadFiles.length))) {
      for (const droppedFile of this.files) {
        const fileExt = (droppedFile.type).split('/')[0];
        const fileSize = (droppedFile.size) / 1024;
        if (fileExt === 'image' && fileSize > 100) {                              // minimum size
          this.imgService.resize([droppedFile], 1600, 900).subscribe((result) => {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onload = (e) => {
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
    console.log(this.uploadFiles);
  }



  public trashImage(index) {
    this.uploadFiles.splice(index, 1);
  }

  trashIncomingImage(index) {
    this.inComingFiles.splice(index, 1);
  }


  capacityChange(v) {
    console.log('capacitychange');
    if (v === '4') {
      console.log('othercapacity');
      this.showCapacityInput = true;
      this.spaceForm.controls['otherSpaceCapacity'].setValidators([Validators.required]);
      this.spaceForm.controls['spaceCapacity'].setErrors(null);
    } else {
      console.log('amincapacity');
      this.showCapacityInput = false;
      this.spaceForm.controls['otherSpaceCapacity'].setValue(null);
      this.spaceForm.controls['otherSpaceCapacity'].setErrors(null);
      this.spaceForm.controls['otherSpaceCapacity'].clearValidators();
    }
  }

  isAmenitySelected(id) {
    return (this.storeCheckedAmenities.indexOf(id) >= 0);
  }

  public amenityChange(id) {
    const idx = this.storeCheckedAmenities.indexOf(id);
    if (idx > -1) {
      this.storeCheckedAmenities.splice(idx, 1);
      console.log(this.storeCheckedAmenities);
    } else {
      this.storeCheckedAmenities.push(id);
      console.log(this.storeCheckedAmenities);
    }
    if (this.storeCheckedAmenities.length === 0) {
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
    console.log(id);
    if (id >= 0) {
      this.OtherAmenityList.splice(id, 1);
    }
  }


  daysHourChange() {
    const selected = this.spaceForm.controls['priceType'].value;
    if (selected === 'day') {
      this.spaceForm.controls['minbookinghours'].setValue(null);
      this.spaceForm.controls['minbookinghours'].setErrors(null);
      this.daysData = 1;
    } else {
      this.spaceForm.controls['minbookingdays'].setValue(null);
      this.spaceForm.controls['minbookingdays'].setErrors(null);
      this.daysData = 0;
    }
  }

  submitSpace(publish): void {
    console.log(publish);
    this.spaceForm.controls['publish'].setValue(publish);
    this.show_publish_spinner = (publish === 1) ? true : false;
    this.show_save_spinner = (publish === 0) ? true : false;
    this.spaceForm.controls['owner_id'].setValue(this.user.id);
    this.spaceForm.controls['otherAmenities'].setValue(this.OtherAmenityList);
    if (this.storeCheckedAmenities.length !== 0) {
      this.spaceForm.controls['amenity'].setValue(this.storeCheckedAmenities.join(', '));
    }

    this.spacesService.modifySpace(this.spaceForm.value, this.inComingFiles, this.uploadFiles, this.not_avail_ar).then((data) => {
      if (data['status']) {
        this.show_publish_spinner = this.show_save_spinner = false;
        this.router.navigate(['user-dashboard/seller-space-listing']);
        this.alert.success('Space updated successfully!');
        console.log('upadted');
      } else if (!data['status'] && data['errors'].picture) {
        this.show_publish_spinner = this.show_save_spinner = false;
        this.alert.error('Upload atleast 1 Picture!');
      } else {
        this.show_publish_spinner = this.show_save_spinner = false;
        this.alert.error('Something went wrong!');
      }
    });
  }


  stateChange(state_id, state_name) {
    this.spaceForm.controls['inputCity'].setValue('');
    this.spacesService.getCityList(state_id).then(data => {
      this.CityList = (data['city'][0] !== undefined) ? data['city'] : [{ id: state_id, name: state_name }];
    });
  }

  setCity(state_id) {
    const rt = this.StateList.filter((x) => x.id === Number(state_id));
    const state_name = rt[0].name;
    this.spacesService.getCityList(state_id).then(data => {
      this.CityList = (data['city'][0] !== undefined) ? data['city'] : [{ id: state_id, name: state_name }];
    });
  }

  ngOnDestroy() {
    // this.dataService.clearDataStorage();
  }

  previewSpace(): void {
    this.show_spinner = true;
    this.spaceForm.controls['owner_id'].setValue(this.user.id);
    this.spaceForm.controls['otherAmenities'].setValue(this.OtherAmenityList);
    if (this.storeCheckedAmenities.length !== 0) {
      this.spaceForm.controls['amenity'].setValue(this.storeCheckedAmenities.join(','));
    }
    localStorage.setItem('modify_route', '1');
    if (this.noday.length > 0) {
      this.not_avail_ar.push(this.noday);
    } else {
      this.not_avail_ar.push(this.blank_arr);
    }
    if (this.nodate.length > 0) {
      this.not_avail_ar.push(this.nodate);
    } else {
      this.not_avail_ar.push(this.blank_arr);
    }
    this.dataService.setDataStorage([this.spaceForm.value, this.uploadFiles, this.inComingFiles, this.not_avail_ar]);
    setTimeout(() => {
      this.router.navigate(['user-dashboard/review-space']);
      this.show_spinner = false;
    }, 1000);
  }
}
