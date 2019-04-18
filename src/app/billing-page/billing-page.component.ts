import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing-page',
  templateUrl: './billing-page.component.html',
  styleUrls: ['./billing-page.component.css']
})
export class BillingPageComponent implements OnInit {
  Featured_Ad = [
    {
      image: 'assets/img/single-space-pics/ft2.jpg',
      spaceType: 'Recording Studio',
      location: '2400 Albany Hwy, Gosnells, Perth 6110',
      stars: '106'

    },
    {
      image: 'assets/img/single-space-pics/ft1.jpg',
      spaceType: 'Photography Studuio',
      location: '2400 Albany Hwy, Gosnells, Perth 6110',
      stars: '98'

    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
