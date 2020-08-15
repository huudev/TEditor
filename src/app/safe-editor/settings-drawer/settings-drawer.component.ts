import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NzMarks } from 'ng-zorro-antd/slider';

import { StoreService } from '../store.service';
import { MEDIUM_COLORS, DARK_COLORS, DEBOUNCE_TIME_DEFAFULT, LONG_PARAGRAPH_DEFAULT } from '@shared/app.const';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take, tap, switchMap, debounceTime } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-settings-drawer',
  templateUrl: './settings-drawer.component.html',
  styleUrls: ['./settings-drawer.component.scss']
})
export class SettingsDrawerComponent implements OnInit {
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

  constructor(
    public store: StoreService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      'range': [],
      'mediumColor': [],
      'longColor': [],
      'longParagraph': []
    });

    this.store.settings$.pipe(
      take(1),
      tap(settings => {
        this.settingsForm.setValue(settings);
      }),
      switchMap(settings => this.settingsForm.valueChanges),
      debounceTime(this.debounceTime),
      untilDestroyed(this)
    ).subscribe(settings => {
      this.store.settings = settings;
      this.save()
    });

  }

  closeSetingsDrawer() {
    this.store.setingsDrawerVisible = false;
  }

  save() {
    localStorage.setItem('settings', JSON.stringify(this.settingsForm.value));
  }

}
