import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { UserService, AppAlertService } from 'src/app/_services';

@Component({
  selector: 'app-subscribe-section',
  templateUrl: './subscribe-section.component.html',
  styleUrls: ['./subscribe-section.component.css']
})
export class SubscribeSectionComponent implements OnInit {
  private subscribeForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private alert: AppAlertService,
    private userService: UserService) {
    this.subscribeForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required,
      Validators.pattern('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')]))
    });
  }

  ngOnInit() {
  }
  subscribe() {
    // console.log(this.subscribeForm.value);
    this.userService.subscribeToMail(this.subscribeForm.value).then(data => {
      console.log(data);
      if (data['status']) {
        this.alert.success('Subscribed successfully!');
      } else if (data['error'] && data['status'] === false) {
        this.alert.error('Already Subscribed!');
      }
    });

  }

}
