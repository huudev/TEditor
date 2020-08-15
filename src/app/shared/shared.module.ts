import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';

import { NgZorroAntdModule } from './ng-zorro-antd.modules';

import { environment } from 'src/environments/environment';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [],
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
    LottieModule
  ]
})
export class SharedModule { }
