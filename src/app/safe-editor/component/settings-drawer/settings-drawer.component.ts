import { SETTING_DEFAULT } from './../../state/editor.state';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take, tap, switchMap, debounceTime } from 'rxjs/operators';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzMarks } from 'ng-zorro-antd/slider';

import { MEDIUM_COLORS, DARK_COLORS, DEBOUNCE_TIME_DEFAFULT } from '@shared/app.const';
import { Select } from '@ngxs/store';
import { EditorState } from '@app/safe-editor/state/editor.state';
import { Observable } from 'rxjs';
import { Settings } from '../../model/settings.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ChangeSettings } from '../../action/editor.action';
import { CloseSetingsDrawer } from '../../action/home.action';
import { HomeState } from '@app/safe-editor/state/home.state';

@UntilDestroy()
@Component({
  selector: 'app-settings-drawer',
  templateUrl: './settings-drawer.component.html',
  styleUrls: ['./settings-drawer.component.scss']
})
export class SettingsDrawerComponent implements OnInit {
  @Select(HomeState.setingsDrawerVisible)
  settingsDrawerVisible$: Observable<boolean>
  debounceTime = DEBOUNCE_TIME_DEFAFULT;
  marks: NzMarks = {
    10: '10',
    20: {
      style: { color: 'orange' },
      label: '20'
    },
    25: {
      style: { color: 'red' },
      label: '25'
    },
    40: {
      style: {
        color: '#f50'
      },
      label: '<strong>40</strong>'
    }
  };

  settingsForm: FormGroup;
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  mediumColors = MEDIUM_COLORS;
  longColors = DARK_COLORS;
  @Select(EditorState.settings)
  settings$: Observable<Settings>

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      'range': [],
      'mediumColor': [],
      'longColor': [],
      'longParagraph': []
    });

    this.settings$.pipe(
      take(1),
      tap(settings => {
        this.settingsForm.setValue(settings);
      }),
      switchMap(settings => this.settingsForm.valueChanges),
      debounceTime(this.debounceTime),
      untilDestroyed(this)
    ).subscribe(settings => {
      this.save(settings)
    });
  }

  @Dispatch()
  closeSetingsDrawer = () => new CloseSetingsDrawer()

  @Dispatch()
  save(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
    return new ChangeSettings(settings);
  }

  resetSettings() {
    localStorage.removeItem('settings');
    this.settingsForm.setValue(SETTING_DEFAULT)
  }

}
