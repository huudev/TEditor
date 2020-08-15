import { Component } from '@angular/core';
import { routerTransition } from '@core/animate';

import { RouteInterceptorService } from '@shared/service/route-interceptor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent {

  constructor(private routeInterceptorService: RouteInterceptorService) { }

  onActivate(event) {
    let trigger = event;
    const previousUrl = this.routeInterceptorService.previousUrl
    const path = this.routeInterceptorService.currentUrl
    const isInit = previousUrl == ''; // có thể bị lỗi do anim lần đầu chạy k được
    const isSame = previousUrl === path;
    const isBackward = previousUrl.startsWith(path);
    const isForward = path.startsWith(this.routeInterceptorService.previousUrl);
       
    if (isInit) {
      this.animParam = {
        value: 'init',
        params: {
          positive: this.positive,
          enterX: this.enterX,
          enterY: this.enterY
        }
      }
      return;
    }

    if (isSame) {
      return;
    }

    if (isBackward) {
      this.positive = '+';
      this.enterX = '-';
      this.enterY = '+';
      trigger = this.animParam.value == 's1' ? 's2' : 's1';
    } else if(isForward) {
      this.positive = '-';
      this.enterX = '+';
      this.enterY = '-';
      trigger = this.animParam.value == 's1' ? 's2' : 's1';
    } else { // section
      if(this.animParam.value!='section'){
        trigger = 'section';
      }
    }

    // + => backward
    // - => forward

    // - + => back
    // + - => forward

    this.animParam = {
      value: trigger, // mục đích thay đổi reference
      params: {
        positive: this.positive,
        enterX: this.enterX,
        enterY: this.enterY
      }
    }
  }
  positive = '+';
  enterX = '+';
  enterY = '-';
  animParam = { // hack first animation not run
    value: 'void',
    params: {
      positive: this.positive,
      enterX: this.enterX,
      enterY: this.enterY
    }
  }
}
