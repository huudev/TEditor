import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  {
    path: '', component: HomeComponent, data: { isCreateMode: true }, canDeactivate: [CanDeactivateGuard]
  }, {
    path: ':id', component: HomeComponent, data: { isCreateMode: false }, canDeactivate: [CanDeactivateGuard]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SafeEditorRoutingModule { }