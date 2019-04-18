import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  user: any;
  constructor(private router: Router,
    private auth: AuthenticationService,
    private route: ActivatedRoute) {
    auth.user.subscribe(output => {
      this.user = JSON.parse(output);
    });
  }

  ngOnInit() {
    this.user = this.auth.getUser();
  }
  chat() {
    this.router.navigate(['chat']);
  }

}
