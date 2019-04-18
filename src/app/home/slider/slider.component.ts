import { Component, OnInit } from '@angular/core';
import { DataService, SpaceService, AppAlertService, AuthenticationService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  private appData: any;
  spaceForm: FormGroup;
  SearchResults: any;
  // picURL = environment.picURL;



  constructor(private dataService: DataService,
    private formBuilder: FormBuilder,
    private alert: AppAlertService,
    private router: Router,
    private auth: AuthenticationService,
    private spacesService: SpaceService) {
    this.spaceForm = this.formBuilder.group({
      searchText: new FormControl('', Validators.required)
    });
    auth.app_data.subscribe(output => {
      this.appData = JSON.parse(output);
    });

  }

  ngOnInit() {
    this.appData = JSON.parse(window.localStorage.getItem('appData'));
    // this.spacesService.getFeaturedSpaces().then((response) => {
    //   console.log(response);
    //   if (response['status']) {
    //     this.SearchResults = response['data'];
    //     // this.SpaceTypeNames = data['spacetype'];
    //     // console.log(this.FeaturedSpaces);
    //   } else {
    //   }
    // });
  }


  onSearchChange(searchValue: string) {
    if (searchValue.length > 3) {
      this.spacesService.searchSpaceList(searchValue).then((response) => {
        console.log(response);
        if (response['status']) {
          this.SearchResults = response['data'];
        } else if (!response['status'] && response['data'] === '') {
          this.SearchResults = [{ title: 'No result Found' }];
        } else {
          this.alert.error('Something went wrong. Try later');
          this.SearchResults = '';
        }
      });
    } else {
      this.SearchResults = '';
    }
  }
  searchnow() {
    if (this.spaceForm.invalid) {
      return false;
    }
    console.log(this.spaceForm.value);
    localStorage.setItem('searchtext', this.spaceForm.value.searchText);
    this.router.navigate(['explore-spaces']);
  }
  gotoSpace(spaceID) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'spaceID': spaceID }
    };
    this.router.navigate(['space-detail'], navigationExtras);

  }
}
