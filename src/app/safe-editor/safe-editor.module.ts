import { NgModule } from '@angular/core';

import { QuillModule } from 'ngx-quill';

import { SharedModule } from '../shared/shared.module';
import { SafeEditorRoutingModule } from './safe-editor-routing.module';
import { StoreService } from './store.service';
import { HomeComponent } from './home/home.component';
import { TitleModalComponent } from './title-modal/title-modal.component';
import { TextInfoComponent } from './text-info/text-info.component';
import { SettingsDrawerComponent } from './settings-drawer/settings-drawer.component';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { quillConfig } from './quill.config';

@NgModule({
  declarations: [HomeComponent, TitleModalComponent, TextInfoComponent, SettingsDrawerComponent],
  imports: [
    SharedModule,
    SafeEditorRoutingModule,
    QuillModule.forRoot(quillConfig),
  ],
  providers: [StoreService, CanDeactivateGuard]
})
export class SafeEditorModule { }
