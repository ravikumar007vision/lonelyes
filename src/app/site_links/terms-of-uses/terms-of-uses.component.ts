import { Component, OnInit } from '@angular/core';
import { UserService, AppAlertService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-terms-of-uses',
  templateUrl: './terms-of-uses.component.html',
  styleUrls: ['./terms-of-uses.component.css']
})
export class TermsOfUsesComponent implements OnInit {
  pageContent: any;
  isDataLoaded = false;

  constructor(private userService: UserService,
    private spinner: NgxSpinnerService,
    private appAlert: AppAlertService,
    private titleService: Title) { }


  ngOnInit() {
    this.spinner.show();
    this.titleService.setTitle('Terms and Conditions : :  Lonely Spaces');
    this.userService.terms_conditions().then((response) => {
      console.log(response);
      this.spinner.hide();
      if (response['status']) {
        this.pageContent = response['data'];
        this.isDataLoaded = true;
      } else {
        this.isDataLoaded = false;
        this.appAlert.error('Something went wrong. Try later');
      }
    });
  }
}
