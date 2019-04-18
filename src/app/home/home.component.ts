import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private titleService: Title) {
    // let user = JSON.parse(localStorage.getItem('user'));
   }

  ngOnInit() {
    this.titleService.setTitle('Home - Lonely Spaces');
  }

}
