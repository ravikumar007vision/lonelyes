import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { AuthenticationService, AppAlertService } from '../_services';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  user: any;
  constructor(private router: Router,
    private alert: AppAlertService,
    private auth: AuthenticationService) {
    auth.user.subscribe(output => {
      this.user = JSON.parse(output);
    });
  }

  ngOnInit() {
    this.user = this.auth.getUser();
  }

}
