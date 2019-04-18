import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppAlertService, AuthenticationService, UserService } from '../_services';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactUS_Form: FormGroup;
  appData: any;
  submitted: any = false;
  user: any;

  enquirySent: any = false;
  spinner: any = false;




  constructor(private formBuilder: FormBuilder,
    private titleService: Title,
    private router: Router,
    private auth: AuthenticationService,
    private userService: UserService,
    private alert: AppAlertService) {
    auth.app_data.subscribe(output => {
      this.appData = JSON.parse(output);
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Contact Us - Lonely Spaces');
    this.appData = JSON.parse(window.localStorage.getItem('appData'));
    this.user = JSON.parse(localStorage.getItem('user')) || '';
    this.contactUS_Form = this.formBuilder.group({
      name: new FormControl(this.user.name, [Validators.compose([Validators.required, Validators.minLength(4)])]),
      email: new FormControl(this.user.email, [Validators.compose([Validators.required, Validators.email])]),
      phone: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10)])]),
      sub: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(5)])]),
      message: new FormControl('', [Validators.compose([Validators.required, Validators.minLength(10)])]),
    });
    this.enquirySent = false;
  }
  get f() {
    return this.contactUS_Form.controls;
  }

  sendEnquiry() {
    this.submitted = this.spinner = true;
    if (this.contactUS_Form.invalid) {
      this.spinner = false;
      return;
    } else {
      this.userService.contact_us(this.contactUS_Form.value).then((result) => {
        console.log(result);
        if (result['status']) {
          this.alert.success(result['data']);
          this.contactUS_Form.reset();
          this.enquirySent = true;
          this.spinner = false;
        } else {
          this.alert.error('Something went wrong. Try later');
        }
      });
    }
  }
  openlink(link) {
    window.open(link, '_blank');
  }
}
