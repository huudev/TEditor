import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';

import { NgZorroAntdModule } from './ng-zorro-antd.modules';

import { environment } from 'src/environments/environment';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { VarDirective } from '../shared/directive/ng-var.directive';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [VarDirective],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgZorroAntdModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule,

    NgZorroAntdModule,
    LottieModule,
    VarDirective
  ]
})
export class SharedModule { }
