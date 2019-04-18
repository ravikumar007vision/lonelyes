import { Component, OnInit } from '@angular/core';
import { UserService, AppAlertService } from 'src/app/_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  pageContent: any;
  isDataLoaded = false;

  constructor(private userService: UserService,
    private spinner: NgxSpinnerService,
    private titleService: Title ,
    private appAlert: AppAlertService) { }

  ngOnInit() {
    this.titleService.setTitle('Support : :  Lonely Spaces');

    this.spinner.show();
    this.userService.getPageContent(6).then((response) => {
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
