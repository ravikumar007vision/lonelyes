import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UserService, SpaceService, AppAlertService, DataService } from '../_services';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  private WatchList: any = [];
  user: any;
  picURL = environment.picURL; 
  public WatchList_const: any = [];
  SpaceTypeNames: any;
  public limit = 4;
  public slicei: any = 0;
  public slicea: any = this.limit;
  public page : any = 1;
  public lastpage : any ;

  constructor(private router: Router,
    private userService: UserService,
    private alert: AppAlertService,
    private dataService: DataService,
    private spacesService: SpaceService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.userService.getUserData();
    this.userService.setPageTitle('My Watchlist : :  Lonely Spaces');
    this.getWishlistSpaces();
  }

  getWishlistSpaces() {
    this.spacesService.getWishListedSpaces(this.user.id).then(data => {
      console.log(data);
      if (data['status'] && data['data'] !== '') {
        this.WatchList_const = this.WatchList = data['data'];
        this.lastpage = Math.floor(this.WatchList.length / this.limit);
      } else if (data['data'] === '' && data['status'] === false) {
        this.WatchList_const = this.WatchList = [];
      } else {
        this.alert.error('Something went wrong. Try later.');
      }
    });
  }
  fetchDeatils(spaceID) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': spaceID }
    };
    this.router.navigate(['space-detail'], navigationExtras);

  }

  removeFromWishList(spaceID) {
    this.spacesService.toggleWishlist(this.user.id, spaceID).then(data => {
      console.log(data);
      if (data['status']) {
        this.getWishlistSpaces();
        this.alert.error('Removed from list.');
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
    if (this.WatchList.length > this.limit) {
      this.slicei = this.lastpage *this.limit;
      this.slicea = this.WatchList.length;
      this.page = this.lastpage+1;
    }
  }

  fLeft() {
    if(this.page > 1){  
      this.page -= 1;  
      this.slicei = (this.page - 1)*this.limit;
      this.slicea = ((this.page - 1)*this.limit)+this.limit;      
    }
  }

  fRight() {
    if(this.lastpage >= this.page){   
      this.page += 1; 
      this.slicei = (this.page - 1)*this.limit;
      this.slicea = ((this.page - 1)*this.limit)+this.limit;    
    }
  }

}


