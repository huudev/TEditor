import { NgModule } from '@angular/core';

import { QuillModule } from 'ngx-quill';
import { NgxsModule } from '@ngxs/store';

import { HomeComponent } from './component/home/home.component';
import { TitleModalComponent } from './component/title-modal/title-modal.component';
import { TextInfoComponent } from './component/text-info/text-info.component';
import { SettingsDrawerComponent } from './component/settings-drawer/settings-drawer.component';
import { SharedModule } from '../shared/shared.module';
import { SafeEditorRoutingModule } from './safe-editor-routing.module';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { quillConfig } from './quill.config';
import { HomeState } from './state/home.state';
import { EditorState } from './state/editor.state';
import { EditorComponent } from './component/editor/editor.component';
import { SupportControlComponent } from './component/support-control/support-control.component';

@NgModule({
  declarations: [
    HomeComponent,
    TitleModalComponent,
    TextInfoComponent,
    SettingsDrawerComponent,
    EditorComponent,
    SupportControlComponent],
  imports: [
    SharedModule,
    SafeEditorRoutingModule,
    QuillModule.forRoot(quillConfig),
    NgxsModule.forFeature([HomeState, EditorState]),
  ],
  providers: [CanDeactivateGuard]
})
export class SafeEditorModule { }
