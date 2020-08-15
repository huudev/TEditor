import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  options: AnimationOptions = {
    path: '/assets/anim-json/28651-back-to-scool_co-gai-cam-sach-va-do-tay-chao.json',
  };
  constructor() { }

  ngOnInit(): void {
  }

}
