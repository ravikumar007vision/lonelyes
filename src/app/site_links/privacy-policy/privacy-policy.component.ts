import { Component, OnInit } from '@angular/core';
import { UserService, AppAlertService } from 'src/app/_services';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  pageContent: any;
  isDataLoaded = false;

  constructor(private userService: UserService,
    private spinner: NgxSpinnerService,
    private appAlert: AppAlertService,
    private titleService: Title) { }

  ngOnInit() {
    this.spinner.show();
    this.titleService.setTitle('Privacy & Policy : :  Lonely Spaces');

    this.userService.privacy_policy().then((response) => {
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
