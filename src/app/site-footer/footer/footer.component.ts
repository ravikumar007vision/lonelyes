import { Component, OnInit } from '@angular/core';
import { DataService, SpaceService, AppAlertService, AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  private appData: any;

  constructor(private auth: AuthenticationService,
    private router: Router) {

    auth.app_data.subscribe(output => {
      this.appData = JSON.parse(output);
    });

  }

  ngOnInit() {
    this.appData = JSON.parse(window.localStorage.getItem('appData'));
    // console.log(this.appData);

  }

  openlink(link) {
    window.open(link, '_blank');
  }

  gotolink(page: any) {
    switch (page) {
      case 'my_space':
        this.router.navigate(['user-dashboard/seller-space-listing']);
        break;

      case 'ad_prog':
        this.router.navigate(['advocate-program']);
        break;

      case 'support':
        this.router.navigate(['support']);
        break;

      case 'services':
        this.router.navigate(['services']);
        break;

      case 'press_media':
        this.router.navigate(['media&press']);
        break;
      case 'careers':
        this.router.navigate(['careers']);
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

}
