import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { environment } from 'src/environments/environment';
import { SpaceService, DataService } from 'src/app/_services';


@Component({
  selector: 'app-featured-space',
  templateUrl: './featured-space.component.html',
  styleUrls: ['./featured-space.component.css']
})
export class FeaturedSpaceComponent implements OnInit {
  FeaturedSpaces: any;
  // SpaceTypeNames: any;
  picURL = environment.picURL;
  constructor(private router: Router,
    private dataService: DataService,
    private spacesService: SpaceService,
    private route: ActivatedRoute) { }


  ngOnInit() {
    this.spacesService.getFeaturedSpaces().then((data) => {
      console.log(data);
      if (data['status']) {
        this.FeaturedSpaces = data['data'];
        // this.SpaceTypeNames = data['spacetype'];
        // console.log(this.FeaturedSpaces);
      } else {
      }
    });

    // console.log(btoa('admin:admin'));
  }

  showSpace(spaceID) {
    console.log(spaceID);
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': spaceID }
    };
    this.router.navigate(['space-detail'], navigationExtras);
    // this.router.navigate(['space-detail']);
  }


  // getSpaceTypeName(spaceTypeID) {
  //   const rt = this.SpaceTypeNames.filter((x) => x.id === Number(spaceTypeID));
  //   return (rt[0].name);
  // }

  // onMouseOver(spaceData) {
  //  let arr =  spaceData.data.picture.split(',');
  //   if (arr.length > 1) {
  //   }

  //   // http://visionvivante.com/lonely_spaces/public/SpaceImages/21/
  // }
  // onMouseOut() {
  //   console.log('out');
  // }
}
