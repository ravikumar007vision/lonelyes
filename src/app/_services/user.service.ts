import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any;

  constructor(private http: HttpClient,
    private titleService: Title) { }

  // get all site related data
  getAppData() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/site_details', '', {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': 'Basic ' + environment.authToken
          }
        )
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // set page title
  setPageTitle(title) {
    this.titleService.setTitle(title);
  }

  // get testimonials on home page
  getTestimonials() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/testimonial', 'xyz', {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get user data
  getUserData() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    // console.log(this.currentUser);
    return this.currentUser;
  }

  // subscribe to  mailchimps
  subscribeToMail(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/mailchimpSubscribe', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // terms & conditions
  terms_conditions() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/termNdConbdition', '', {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  //  privacy & Policy
  privacy_policy() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/PrivacyNdpolicy', '', {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        }, () => {

        });
    });
  }

  // contact us
  contact_us(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/contact_us', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        }, () => {

        });
    });
  }


  // get page details dynamically
  getPageContent(page_id: any) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/PageContent', { page_id: page_id }, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }





}
