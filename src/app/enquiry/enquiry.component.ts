import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {
  Enquiry_List = [
    {
      sn: 1,
      enquiry_id: 547,
      type: 'Commercial Space',
      location: '123 Florida, Blvd,Crystal Beach,FL3468',
      time_duration: '24-08-2018 To 08-12-2018',
      status: 'open',
    },
    {
      sn: 2,
      enquiry_id: 57,
      type: 'Advertising Space',
      location: '123 Florida, Blvd,Crystal Beach,FL3468',
      time_duration: '14-07-2018 To 11-08-2018',
      status: 'closed',
    },
    {
      sn: 3,
      enquiry_id: 47,
      type: 'Commercial Space',
      location: '123 Florida, Blvd,Crystal Beach,FL3468',
      time_duration: '25-08-2018 To 18-11-2018',
      status: 'pending',
    },
    {
      sn: 4,
      enquiry_id: 5,
      type: 'Soul Space',
      location: '123 Florida, Blvd,Crystal Beach,FL3468',
      time_duration: '19-08-2018 To 08-12-2018',
      status: 'open',
    },

  ];



  constructor() { }

  ngOnInit() {
  }

}
