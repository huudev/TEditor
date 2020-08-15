import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from '@core/component/home-page/home-page.component';
import { CustomPreloadingStrategy } from './custom-preloading-strategy';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'safe-editor', loadChildren: () => import('@app/safe-editor/safe-editor.module').then(m => m.SafeEditorModule), data: { preload: true } },
  { path: 'articles', loadChildren: () => import('@app/article/article.module').then(m => m.ArticleModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
