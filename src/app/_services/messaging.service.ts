import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) { }



  // get all chat participants
  getAllChatParticipants(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiURL + '/GetChatListing', JSON.stringify(data), {
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

  // get chat history of a personal chat
  getPersonalChat(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiURL + '/GetMessageListing', JSON.stringify(data), {
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


  //  send personal messages
  sendMSG(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiURL + '/SendMessage', JSON.stringify(data), {
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


  // get msg notification 
  getMSGNotification(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiURL + '/unread_count', JSON.stringify(data), {
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

  // clear notifications
  clearNotifications(userID, typeID) {
    const body = { receiver_id: userID, type: typeID }
    return new Promise((resolve, reject) => {
      this.http.post(this.apiURL + '/ChangeSpaceNotification', JSON.stringify(body), {
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
