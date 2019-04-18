import { Component, OnInit } from '@angular/core';
import { UserService, AppAlertService } from 'src/app/_services';

@Component({
  selector: 'app-customer-testimonial',
  templateUrl: './customer-testimonial.component.html',
  styleUrls: ['./customer-testimonial.component.css']
})
export class CustomerTestimonialComponent implements OnInit {
  TestimonialData: any;
  TestimonialPositionData: any;

  Testimonials = [
    {
      'user': 'Herald Finch',
      'title': 'Manager',
      'image': 'assets/user/user.jpg',
      // tslint:disable-next-line:max-line-length
      'comment': 'Thank you, Lonely Spaces. Top quality site, and so easy to use. Sharing our space with our local community is important to us, and this website has allowed us to connect with organisations and causes that we care about. Highly recommend to other space owners.'
    },
    {
      'user': 'Johny Depp',
      'title': 'Director',
      'image': 'assets/user/user1.jpg',
      // tslint:disable-next-line:max-line-length
      'comment': 'Welcome, Lonely Spaces. Top quality site, and so easy to use. Sharing our space with our local community is important to us, and this website has allowed us to connect with organisations and causes that we care about. Highly recommend to other space owners.'
    },
    {
      'user': 'Lara Croft',
      'title': 'Producer',
      'image': 'assets/user/user6.png',
      // tslint:disable-next-line:max-line-length
      'comment': 'Greetings, Lonely Spaces. Top quality site, and so easy to use. Sharing our space with our local community is important to us, and this website has allowed us to connect with organisations and causes that we care about. Highly recommend to other space owners.'
    }
  ];

  constructor(private userService: UserService,
    private alert: AppAlertService) { }

  ngOnInit() {
    this.userService.getTestimonials()
      .then((data) => {
        if (data['status']) {
          this.TestimonialData = data['data'];
          this.TestimonialPositionData = data['Positions'];
        } else {
          this.alert.error('Something');
        }
      });
  }

  getTitle(id) {
    const rt = this.TestimonialPositionData.filter((x) => x.id === Number(id));
    return (rt[0].name);

  }

}
