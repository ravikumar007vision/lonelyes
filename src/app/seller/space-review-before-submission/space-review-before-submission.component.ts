import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService, SpaceService, AppAlertService } from 'src/app/_services';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-space-review-before-submission',
  templateUrl: './space-review-before-submission.component.html',
  styleUrls: ['./space-review-before-submission.component.css']
})
export class SpaceReviewBeforeSubmissionComponent implements OnInit {
  private user: any;
  private createSpaceAllData: any;
  private otherInfo: any;
  private createSpaceData: any;
  private createSpaceFiles: any;
  private createSpaceDay: any;
  private createSpaceDate: any;


  private SpaceTypes: any = [];
  private CapacityList: any = [];
  private AmenityList: any = [];
  private CanPolicyList: any = [];
  private StateList: any = [];
  private CityList: any = [];
  picURL = environment.picURL;

  public storeCheckedAmenities: any = [];


  nodate: any = [];
  noday: any = [];
  spaceTypeName: any;
  spaceCapacity: any;
  stateName: any;
  cityName: any;
  canPolicyDetail: any;
  IncomingAmenityIDList: any;
  modify_route: any;
  inComingFiles: any = [];

  OtherAmenityList: any = [];
  show_publish_spinner: any = false;
  private IncomingAmenityNamesListArr: any = [];
  private IncomingAmenityNamesListStr: any = '';
  private uploadFiles: any = [];
  private showOtherAmenity = false;
  private show_save_spinner = false;
  private show_submit_spinner = false;

  constructor(private dataService: DataService,
    private alert: AppAlertService,
    private location: Location,
    private router: Router,
    private spacesService: SpaceService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.modify_route = localStorage.getItem('modify_route');
    this.createSpaceAllData = this.dataService.getDataStorage();
    this.createSpaceData = this.createSpaceAllData[0];
    this.createSpaceFiles = this.createSpaceAllData[1];
    this.createSpaceDay = this.createSpaceAllData[3];
    console.log('---------------------------------------');
    console.log(this.createSpaceData);
    console.log(this.createSpaceDay);
    console.log('---------------------------------------');

    this.nodate = this.createSpaceDay[1];
    this.noday = this.createSpaceDay[0];

    this.inComingFiles = this.createSpaceAllData[2];

    const body = { 'user_id': this.user.id };
    this.spacesService.getCreateSpaceFormData(body).then((data) => {
      this.otherInfo = data;
      // console.log(JSON.stringify(data));
      this.SpaceTypes = data['spacetype'];
      this.CapacityList = data['capacityspace'];
      this.AmenityList = data['amenities'];
      this.CanPolicyList = data['cancel_policy'];
      this.StateList = data['state'];
      this.getinfo();
      this.getAmenitiesList();
      this.getCityName();

    });
  }

  ngOnInit() {
  }

  getinfo() {

    const rt1 = this.SpaceTypes.filter((x) => x.id === Number(this.createSpaceData.spaceType));
    this.spaceTypeName = rt1[0].name;

    const rt2 = this.CapacityList.filter((x) => x.id === Number(this.createSpaceData.spaceCapacity));
    this.spaceCapacity = rt2[0].name;

    const rt3 = this.StateList.filter((x) => x.id === Number(this.createSpaceData.inputState));
    this.stateName = rt3[0].name;

    const rt4 = this.CanPolicyList.filter((x) => x.id === Number(this.createSpaceData.cancel_policy));
    this.canPolicyDetail = rt4[0].name;

  }


  getCityName() {
    this.spacesService.getCityList(this.createSpaceData.inputState).then(data => {
      if (data['city'][0] !== undefined) {
        this.CityList = data['city'];
        const rt5 = this.CityList.filter((x) => x.id === Number(this.createSpaceData.inputCity));
        this.cityName = rt5[0].name;
      } else {
        this.cityName = this.stateName;
      }
    });
  }

  getAmenitiesList() {
    this.IncomingAmenityIDList = this.createSpaceData.amenity.split(',');
    for (const item of this.IncomingAmenityIDList) {
      const rt = this.AmenityList.filter((x) => x.id === Number(item));
      this.IncomingAmenityNamesListArr.push(rt[0].amenities_name);
    }
    this.showOtherAmenity = (this.createSpaceData['otherAmenities'].length > 0) ? true : false;
    this.IncomingAmenityNamesListArr = this.IncomingAmenityNamesListArr.filter(item => item !== 'Other Amenities');
    this.IncomingAmenityNamesListStr = this.IncomingAmenityNamesListArr.toString();
  }


  submitSpace(): void {
    this.show_submit_spinner = true;
    this.spacesService.createSpace(this.createSpaceData, this.createSpaceFiles, 1, this.createSpaceDay).then((data: any) => {
      console.log(JSON.stringify(data));
      if (data['success'] === 'space created successfully') {
        this.show_submit_spinner = false;
        this.alert.success('Space created successfully!');
        this.router.navigate(['user-dashboard/seller-space-listing']);
      } else {
        this.show_submit_spinner = false;
        this.alert.success('Something went Wrong!');
      }
    });
  }


  saveSpace(): void {
    this.show_save_spinner = true;
    console.log(JSON.stringify(this.createSpaceData));

    this.spacesService.createSpace(this.createSpaceData, this.createSpaceFiles, 0, this.createSpaceDay).then((data: any) => {
      console.log(JSON.stringify(data));
      if (data['success'] === 'space created successfully') {
        this.show_submit_spinner = false;
        this.alert.success('Space Saved!');
        this.router.navigate(['user-dashboard/seller-space-listing']);
        console.log('saved');
      } else {
        console.log('not saved');

        this.show_submit_spinner = false;
        this.alert.success('Something went Wrong!');
      }
    });
  }
  goback() {
    localStorage.setItem('setpreview', '1');
    if (this.modify_route === '1') {
      const navigationExtras: NavigationExtras = { queryParams: { 'spaceID': this.createSpaceData.spaceId } };
      this.router.navigate(['user-dashboard/modify-space'], navigationExtras);
    } else {
      this.router.navigate(['user-dashboard/create-space']);
    }
  }

  onSubmit(publish): void {
    this.show_publish_spinner = (publish === 1) ? true : false;
    this.show_save_spinner = (publish === 0) ? true : false;
    console.log(this.createSpaceData);
    this.createSpaceData.publish = publish;
    this.spacesService.modifySpace(this.createSpaceData, this.inComingFiles, this.uploadFiles, this.createSpaceDay).then((data) => {
      if (data['status']) {
        this.show_publish_spinner = this.show_save_spinner = false;
        this.router.navigate(['user-dashboard/seller-space-listing']);
        this.alert.success('Space updated successfully!');
      } else if (!data['status'] && data['errors'].picture) {
        this.show_publish_spinner = this.show_save_spinner = false;
        this.alert.error('Upload atleast 1 Picture!');
      } else {
        this.show_publish_spinner = this.show_save_spinner = false;
        this.alert.error('Something went wrong!');
      }
    });

  }
}
