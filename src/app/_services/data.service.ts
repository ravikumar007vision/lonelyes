import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  space_id: any;
  tempData: any;

  constructor() { }

  setDataStorage(data: any) {
    localStorage.setItem('myData', JSON.stringify(data));
  }

  getDataStorage() {
    return JSON.parse(localStorage.getItem('myData'));
  }

  clearDataStorage() {
    localStorage.removeItem('myData');
  }

  doTrim(INtext, INlength) {
    const incomingText = INtext;
    const textlength = incomingText.length;
    if (textlength > INlength) {
      const temp = incomingText.substring(0, INlength);
      const spaceLoc = temp.lastIndexOf(' ');
      const temp2 = incomingText.substring(0, spaceLoc).concat('...');
      return temp2;
    } else {
      return INtext;
    }
  }
}

