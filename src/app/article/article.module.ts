import { NgModule } from '@angular/core';

import { ArticleRoutingModule } from './article-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
