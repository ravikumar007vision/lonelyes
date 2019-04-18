import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AppAlertService, SpaceService, DataService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-seller-space-listing',
  templateUrl: './seller-space-listing.component.html',
  styleUrls: ['./seller-space-listing.component.css']
})
export class SellerSpaceListingComponent implements OnInit {
  user: any;
  showEmpty: any;
  public MySpace_List: any = [];
  public MySpace_const: any = [];
  SpaceTypeNames: any;
  public limit = 3;
  public slicei: any = 0;
  public slicea: any = this.limit;
  public page: any = 1;
  public lastpage: any;



  constructor(private spacesService: SpaceService,
    private titleService: Title,
    private dataService: DataService,
    private alert: AppAlertService,
    private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('My space Listing : : Lonely Spaces');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.spacesService.SellerSpaceList(this.user.id).then((data) => {
      if (data['status']) {

        this.MySpace_List = this.MySpace_const = data['data'];
        console.log(this.MySpace_List);

        this.lastpage = Math.floor(this.MySpace_List.length / this.limit);
        // this.SpaceTypeNames = data['spacetype'];
        // console.log(this.SpaceTypeNames);
        this.showEmpty = false;
      } else {
        this.alert.error('No Spaces found!');
        this.showEmpty = true;
      }
    });
  }

  filterSpaces(status: number) {
    if (status === 0) {
      this.MySpace_List = this.MySpace_const.filter((x: { publish: string; }) => x.publish === '0');
    } else if (status === 1) {
      this.MySpace_List = this.MySpace_const.filter((x: { publish: string; }) => x.publish === '1');
    } else {
      this.MySpace_List = this.MySpace_const;
    }
  }

  mLeft() {
    this.slicei = 0;
    this.slicea = this.limit;
    this.page = 1;
  }

  mRight() {
    if (this.MySpace_List.length > this.limit) {
      this.slicei = this.lastpage * this.limit;
      this.slicea = this.MySpace_List.length;
      this.page = this.lastpage + 1;
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
    if (this.lastpage >= this.page) {
      this.page += 1;
      this.slicei = (this.page - 1) * this.limit;
      this.slicea = ((this.page - 1) * this.limit) + this.limit;
    }
  }

  modifySpace(spaceID: string | number) {
    console.log(spaceID);
    console.log(typeof (spaceID));

    const navigationExtras: NavigationExtras = { queryParams: { 'spaceID': spaceID } };
    this.router.navigate(['user-dashboard/modify-space'], navigationExtras);
  }


  delSpace(spaceID: any) {
    this.spacesService.deleteSpace(this.user, spaceID)
      .then((data) => {
        if (data['status']) {
          this.alert.success('Space removed successfully!');
          this.ngOnInit();
        } else {
          this.alert.error('Something went wrong!');
        }
      });
  }

  getSpaceTypeName(spaceTypeID) {
    const rt = this.SpaceTypeNames.filter((x) => x.id === Number(spaceTypeID));
    return (rt[0].name);
  }

  doTrim(INtext, INlength) {
    return this.dataService.doTrim(INtext, INlength);
  }

  goto(space_id) {
    const navigationExtras: NavigationExtras = { queryParams: { 'spaceID': space_id } };
    this.router.navigate(['space-detail'], navigationExtras);
  }
}
