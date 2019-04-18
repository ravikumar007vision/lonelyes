import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Options, LabelType } from 'ng5-slider';

import { SpaceService, AppAlertService, DataService } from '../_services';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-explore-spaces',
  templateUrl: './explore-spaces.component.html',
  styleUrls: ['./explore-spaces.component.css']
})
export class ExploreSpacesComponent implements OnInit, OnDestroy {
  user: any;
  spaceForm: FormGroup;
  picURL = environment.picURL;

  catID: any;

  isGridView = true;
  noResultsFound = false;

  private SpaceTypes: any = [];
  private StateList: any = [];
  private CityList: any = [];

  offset: number = 1;
  private SearchResult: any = [];
  // price slider
  minValue: any = 0;
  maxValue: any;
  ceilValue: any;
  searchtext: any;

  options: Options = {
    floor: 0,
    ceil: this.ceilValue,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min:</b> $' + value;
        case LabelType.High:
          return '<b>Max:</b> $' + value;
        default:
          return '$' + value;
      }
    }
  };

  constructor(private _route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private alert: AppAlertService,
    private spacesService: SpaceService,
    private dataService: DataService,
    private route: ActivatedRoute) {
    this.user = JSON.parse(localStorage.getItem('user')) || '';


    this.catID = localStorage.getItem('catID') || '';
    this.searchtext = localStorage.getItem('searchtext') || '';
    localStorage.removeItem('searchtext');
    console.log(this.catID);


    this.spaceForm = this.formBuilder.group({
      searchText: new FormControl(this.searchtext),
      spaceType: new FormControl(this.catID),
      inputCity: new FormControl(''),
      inputState: new FormControl(''),
      price: new FormControl(''),
      time_base: new FormControl(''),
      sort_by: new FormControl('id'),
      order: new FormControl('DESC'),
    });
    this.searchSpace(this.offset, 0);
  }

  ngOnInit() {
    const body = (this.user.id) ? { 'user_id': this.user.id } : { 'user_id': 0 };
    this.titleService.setTitle('Explore Spaces : : Lonely Spaces');
    this.spacesService.getCreateSpaceFormData(body).then((data) => {
      // console.log(JSON.stringify(data));
      this.SpaceTypes = data['spacetype'];
      this.StateList = data['state'];
    });
  }

  onScroll() {
    console.log('scrolled!!');
    this.offset = this.offset + 1;
    this.searchSpace(this.offset, 0);
  }

  get_sortedBY(ev) {
    if (ev.target.value === 'lTh') {
      this.spaceForm.controls['sort_by'].setValue('pricerate');
      this.spaceForm.controls['order'].setValue('ASC');
    } else if (ev.target.value === 'hTl') {
      this.spaceForm.controls['sort_by'].setValue('pricerate');
      this.spaceForm.controls['order'].setValue('DESC');
    } else {
      this.spaceForm.controls['sort_by'].setValue(ev.target.value);
      this.spaceForm.controls['order'].setValue('DESC');
    }
    this.searchSpace(1, 1);
  }


  // toggle_List_Grid(type) {
  //   this.isGridView = (type === 'grid') ? true : false;
  // }

  daysHourChange() {
    return;
    // const selected = this.spaceForm.controls['time_base'].value;
    // this.maxValue = (selected === 'day') ? 600 : 75;
    // this.ceilValue = (selected === 'day') ? 1000 : 100;
    // const options: Options = {
    //   floor: 0,
    //   ceil: this.ceilValue,
    //   translate: (value: number, label: LabelType): string => {
    //     switch (label) {
    //       case LabelType.Low:
    //         return '<b>Min:</b> $' + value;
    //       case LabelType.High:
    //         return '<b>Max:</b> $' + value;


    //       default:
    //         return '$' + value;
    //     }
    //   }
    // };
    // this.options = options;
    // console.log(this.maxValue);
    // console.log(this.options);
  }

  stateChange(state_id, state_name) {
    this.spaceForm.controls['inputCity'].setValue('');
    this.spacesService.getCityList(state_id).then(data => {
      this.CityList = (data['city'][0] !== undefined) ? data['city'] : [{ id: state_id, name: state_name }];
    });
  }


  searchSpace(offset: any, frm: any) {
    if (frm === 1) {
      this.SearchResult = [];
      this.offset = 1;
    }

    localStorage.setItem('catID', this.spaceForm.get('spaceType').value);
    this.spacesService.searchSpaces(this.spaceForm.value, offset).then(data => {
      console.log(data);
      if (data['status']) {
        this.SearchResult = [...this.SearchResult, ...data['data']];
        // this.SearchResult = data['data'];
        console.log(this.SearchResult);
        this.noResultsFound = false;
      } else if (!data['status'] && data['data'] === '' && this.SearchResult.length == 0) {
        this.noResultsFound = true;
        this.SearchResult = [];
      }
      if (frm == 1) {
        this.maxValue = this.spaceForm.get('spaceType').value[1];
      } else {
        this.maxValue = data['mprice'];
      }

      this.ceilValue = data['mprice'];
      const options: Options = {
        floor: 0,
        ceil: this.ceilValue,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return '<b>Min:</b> $' + value;
            case LabelType.High:
              return '<b>Max:</b> $' + value;
            default:
              return '$' + value;
          }
        }
      };
      this.options = options;
    });
  }

  fetchDeatils(space_id) {
    const navigationExtras: NavigationExtras = { queryParams: { 'spaceID': space_id } };
    this.router.navigate(['space-detail'], navigationExtras);
  }

  ngOnDestroy() {
    localStorage.removeItem('catID');
  }
}
