import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  @Output() user: EventEmitter<any> = new EventEmitter();
  @Output() profile_pic: EventEmitter<any> = new EventEmitter();
  @Output() app_data: EventEmitter<any> = new EventEmitter();

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  constructor(private http: HttpClient) { }

  updateUser(user: any) {
    this.user.emit(user);
  }
  appData(data: any) {
    this.app_data.emit(data);
  }

  updateProfile_pic(profile_img: any) {
    this.profile_pic.emit(profile_img);
  }

  getUser() {
    if (localStorage.getItem('user') !== null) {
      return JSON.parse(localStorage.getItem('user'));
    } else {
      return null;
    }
  }


  // login user
  tryLogin(loginForm) {
    const formData = {
      username: loginForm.value.username,
      password: loginForm.value.password
    };

    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/appLogin', JSON.stringify(formData), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
          //
        });
    });
  }


  tryRegister(registrationFrom) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const options = {
      headers: headers
    };
    const formData = {
      fname: registrationFrom.value.fname,
      lname: registrationFrom.value.lname,
      // company: registrationFrom.value.company,
      email: registrationFrom.value.email,
      phone: registrationFrom.value.phone,
      password: registrationFrom.value.password,
      role: registrationFrom.value.role
    };
    // console.log(formData);
    return this.http.post(environment.apiURL + '/appRegister', JSON.stringify(formData), { headers });
  }
  verifyemail(data) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const options = {
      headers: headers
    };
    const formData = {
      code: data.value.verification_code,
      id: data.value.user_id,
    };
    // console.log(formData);
    return this.http.post(environment.apiURL + '/verify_mail', JSON.stringify(formData), { headers });
  }

  resendemail(data) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const options = {
      headers: headers
    };
    const formData = {
      id: data
    };
    // console.log(formData);
    return this.http.post(environment.apiURL + '/resend_mail', JSON.stringify(formData), { headers });
  }


  // dit profile information
  editProfile(profile_data) {
    const body = {
      userid: profile_data.value.userid,
      fname: profile_data.value.fname,
      lname: profile_data.value.lname,
      email: profile_data.value.email,
      phone: profile_data.value.phone,
      role: profile_data.value.role,
    };

    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/editProfile', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
          //
        });
    });
  }

  // upload profile picture
  upload_dp(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/editProfileImage', data)
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
          // something
        });
    });
  }

  // check is there an user??
  isUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user == null) { return false; } else { return true; }
  }

  // forget password
  forgetpassword(data) {
    const params = new HttpParams().set('email', data.email);
    const httpOptions = { headers: new HttpHeaders({ 'Accept': 'application/json; charset=UTF-8' }) };
    return this.http.post(environment.apiURL + '/password/email', params, httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>(''))
    );
  }

  // reset forgotten password
  resetForgottenpswd(data, INemail) {
    // tslint:disable-next-line:max-line-length
    const params = new HttpParams().set('email', INemail).set('password', data.password).set('password_confirmation', data.password).set('token', data.token);
    const httpOptions = { headers: new HttpHeaders({ 'Accept': 'application/json; charset=UTF-8' }) };
    return this.http.post(environment.apiURL + '/password/reset', params, httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>(''))
    );
  }

  // change old password
  changepassword(data, cuser) {
    const creds = {
      user_id: cuser.id,
      token: cuser.api_token,
      old_password: data.old_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password
    };

    console.log(creds);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
    };
    return this.http.post(environment.apiURL + '/update_password', JSON.stringify(creds), httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('Please check details and try again'))
    );
  }


  changeRole(user_id) {
    const body = { user_id: user_id };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/ChangeUserRole', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
          //
        });
    });
  }

//  get user details from database
  getuser(user) {
    const body = { user_id: user };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/user_details', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
          //
        });
    });
  }
}
