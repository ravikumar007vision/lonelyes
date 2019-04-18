import { Injectable, OnInit } from '@angular/core';
import { AlertsService } from 'angular-alert-module';


@Injectable({
  providedIn: 'root'
})
export class AppAlertService implements OnInit {

  constructor(private alert: AlertsService) { }


  ngOnInit(): void {
    this.alert.setDefaults('timeout', 3000);
  }
  setTimer(sec: any) {
    this.alert.setDefaults('timeout', sec);
  }
  success(msg: any) {
    this.alert.setMessage(msg, 'success');
  }
 warn(msg: any) {
    this.alert.setMessage(msg, 'warn');
  }
  error(msg: any) {
    this.alert.setMessage(msg, 'warn');
  }
  
}
