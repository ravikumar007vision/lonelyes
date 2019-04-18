import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService, AppAlertService, MessagingService, UserService, DataService } from '../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // @Output() msg_count: EventEmitter<any> = new EventEmitter();


  private currentUser: any;
  private profile_pic: any;
  private showdp: any = false;
  private appData: any;


  private isUserLoggedIn: any;
  private apiBODY: any;
  private unread_msg_count: any = 0;
  private unread_notification_count: any = 0;
  private NotificationList: any = [];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private alert: AppAlertService,
    // private userService: UserService,
    private msgService: MessagingService,
    private auth: AuthenticationService) {

    auth.user.subscribe(output1 => {
      this.currentUser = JSON.parse(output1);
      if (this.currentUser) {
        this.apiBODY = { receiver_id: this.currentUser.id };
        this.isUserLoggedIn = true;
        this.get_msg_notification4first_time();
      } else {
        this.isUserLoggedIn = false;
      }

    });
    auth.app_data.subscribe(output1 => {
      this.appData = JSON.parse(output1);
    });

    auth.profile_pic.subscribe(output2 => {
      if (output2 !== '') {
        this.showdp = true;
        this.profile_pic = output2 + '?' + Math.random();
      } else {
        this.showdp = false;
      }
    });

  }

  ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      this.currentUser = JSON.parse(localStorage.getItem('user'));
      this.profile_pic = localStorage.getItem('profile_pic');
      this.showdp = (this.profile_pic !== '' && this.profile_pic !== null) ? true : false;
      this.isUserLoggedIn = true;
      this.apiBODY = { receiver_id: this.currentUser.id };
      this.get_msg_notification4first_time();

    } else {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          const currentUrl = event.url;
          if ((currentUrl !== '/home') && (currentUrl !== '/login')) {
            //   this.router.navigate(['home']);
          }
        }
      });
    }


    this.appData = JSON.parse(window.localStorage.getItem('appData'));
    this.get_msg_notification();
  }

  get_msg_notification4first_time() {
    if (this.isUserLoggedIn) {
      this.msgService.getMSGNotification(this.apiBODY).then((response) => {
        if (response['status']) {
          this.unread_msg_count = response['data'];
          this.unread_notification_count = this.unread_msg_count + response['SpaceNotification'].length;
          this.NotificationList = response['SpaceNotification'];
        } else {
          this.unread_msg_count = 0;
          this.unread_notification_count = 0;
          this.NotificationList = [];
        }
      });
    }
  }

  get_msg_notification() {
    setInterval(() => {
      if (this.isUserLoggedIn) {
        this.msgService.getMSGNotification(this.apiBODY).then((response) => {
          if (response['status']) {
            this.unread_msg_count = response['data'];
            this.unread_notification_count = this.unread_msg_count + response['SpaceNotification'].length;
            this.NotificationList = response['SpaceNotification'];
          } else {
            this.unread_msg_count = 0;
            this.unread_notification_count = 0;
            this.NotificationList = [];

          }
        });
      }
    }, 10000);

  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('profile_pic');
    this.alert.warn('Logged out');
    // localStorage.clear();
    // window.location.reload();
    this.auth.updateUser(null);
    this.currentUser = null;
    this.router.navigate(['home']);
    this.unread_msg_count = 0;
    this.unread_notification_count = 0;
    this.NotificationList = [];


  }
  openlink(link) {
    window.open(link, '_blank');
  }
  gotoProfile() {
    this.router.navigate(['user-dashboard']);
  }
  doTrim(INtext, INlength) {
    return this.dataService.doTrim(INtext, INlength);
  }

  // notification redirects to respective page
  goto(page_id) {
    switch (page_id) {
      case 1:
        this.clearNotification(1);
        this.router.navigate(['user-dashboard/bookings']);
        break;
      case 2:
        this.clearNotification(2);
        this.router.navigate(['user-dashboard/reservations']);
        break;
      case 3:
        this.clearNotification(3);
        this.router.navigate(['user-dashboard/reservations']);
        break;
      default:
        break;
    }
  }

  // clear the notification
  clearNotification(notification_type) {
    this.msgService.clearNotifications(this.currentUser.id, notification_type).then((result) => {
      if (result['status']) {
        this.get_msg_notification4first_time();
      } else {
        this.alert.error('Something went wrong.Please Try later');
      }
    });
  }
}





// notification status
// 1.book space
// 2.approve the booking
// 3.reject the booking
// 9.give space review