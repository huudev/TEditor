import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import en from '@angular/common/locales/en';

import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { SharedModule } from '@app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '@core/component/app/app.component';
import { HomePageComponent } from '@core/component/home-page/home-page.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
