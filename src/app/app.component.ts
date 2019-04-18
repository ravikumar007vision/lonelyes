import { Component, OnInit } from '@angular/core';


import { Router, NavigationEnd } from '@angular/router';
import { UserService, AppAlertService, AuthenticationService } from './_services';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router,
    private alert: AppAlertService,
    private userService: UserService,
    private auth: AuthenticationService, ) {

    // get all app related data
    this.userService.getAppData().then((data: any) => {
      // console.log(JSON.stringify(data));
      if (data['status']) {
        localStorage.setItem('appData', JSON.stringify(data['data']));
        this.auth.appData(JSON.stringify(data['data']));
      } else { this.alert.error('Website is under maintenance!'); }

    }).catch(function (fallback) {
      console.log('error');
      console.log(fallback);
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
