import { Component, OnInit } from '@angular/core';
import { SpaceService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { NavigationExtras, Router } from '@angular/router';



@Component({
  selector: 'app-search-by-category',
  templateUrl: './search-by-category.component.html',
  styleUrls: ['./search-by-category.component.css'],
})
export class SearchByCategoryComponent implements OnInit {

  AllCatData: any;
  bc_img_URL = environment.picURLSpaceType + '/SpaceTypeImage/1/';
  icon_img_URL = environment.picURLSpaceType + '/SpaceTypeIcon/1/';

  constructor(private spacesService: SpaceService,
    private router: Router) { }

  ngOnInit() {
    // getCategorySpace
    this.spacesService.getAllcategories().then((response) => {
      // console.log(response);
      if (response['status']) {
        this.AllCatData = response['spacetype'];
      } else {
      }
    });
  }

  myStyle(space): object {
    return {
      'background-image': 'url(' + this.bc_img_URL + space + ')',
    };
  }

  gotoCat(catID) {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { 'catID': catID }
    // };

    localStorage.setItem('catID', catID);
    this.router.navigate(['explore-spaces']);
  }
}
