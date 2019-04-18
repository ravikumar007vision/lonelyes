import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  makePayment(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiURL + '/s', JSON.stringify(data), {
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
}
