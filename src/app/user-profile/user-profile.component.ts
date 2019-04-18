import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService, AppAlertService, } from 'src/app/_services';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private profilePic: any;
  user: any;
  role: any;
  constructor(private router: Router,
    private titleService: Title,
    private auth: AuthenticationService,
    private route: ActivatedRoute) {

    auth.user.subscribe(output => {
      this.user = JSON.parse(output);
    });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getuser();
    this.auth.user.subscribe(output => {
      this.user = JSON.parse(output);
    });
    console.log(this.user);
    this.profilePic = localStorage.getItem('profile_pic') + '?=' + Math.random();
    this.titleService.setTitle('My Profile : : Lonely Spaces');
    if (this.user.role === '4') {
      this.role = 'Space Owner & Renter';
    } else if (this.user.role === '3') {
      console.log('3');
      this.role = 'Space Renter';
    } else if (this.user.role === '1') {
      this.role = 'admin';
    } else {
      this.role = 'Space Owner';
    }
  }
  edit_profile() {
    this.router.navigate(['user-dashboard/edit-profile']);
  }

  getuser(): void {
    this.auth.getuser(this.user.id).then((data: any) => {
      localStorage.setItem('user', JSON.stringify(data['data']));
      this.auth.updateUser(JSON.stringify(data['data']));
      console.log(JSON.stringify(data));
    });
  }

}

