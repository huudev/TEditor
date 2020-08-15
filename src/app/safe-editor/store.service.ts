import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RANGE_SENTENCE_DEFAULT, MEDIUM_SENTENCE_COLOR_DEFAULT, LONG_SENTENCE_COLOR_DEFAULT, LONG_PARAGRAPH_DEFAULT } from '../shared/app.const';
import { Settings } from './model/settings.model';
import { Article } from '../shared/model/article.model';
import { ToolService } from '../shared/service/tool.service';

@Injectable()
export class StoreService {
  private readonly _article = new BehaviorSubject<Article>(null);
  readonly article$ = this._article.asObservable();
  get artilce(): Article {
    return this._article.getValue();
  }
  set artilce(val: Article) {
    this._article.next(val);
  }

  private readonly _titleModalVisible = new BehaviorSubject<boolean>(false);
  readonly titleModalVisible$ = this._titleModalVisible.asObservable();
  get titleModalVisible(): boolean {
    return this._titleModalVisible.getValue();
  }
  set titleModalVisible(val: boolean) {
    this._titleModalVisible.next(val);
  }

  private readonly _articleSaveLoading = new BehaviorSubject<boolean>(false);
  readonly articleSaveLoading$ = this._articleSaveLoading.asObservable();
  get articleSaveLoading(): boolean {
    return this._articleSaveLoading.getValue();
  }
  set articleSaveLoading(val: boolean) {
    this._articleSaveLoading.next(val);
  }

  private readonly _settingsDrawerVisible = new BehaviorSubject<boolean>(false);
  readonly settingsDrawerVisible$ = this._settingsDrawerVisible.asObservable();
  get settingsDrawerVisible(): boolean {
    return this._settingsDrawerVisible.getValue();
  }
  set setingsDrawerVisible(val: boolean) {
    this._settingsDrawerVisible.next(val);
  }

  readonly SETTING_DEFAULT: Settings = {
    range: RANGE_SENTENCE_DEFAULT,
    mediumColor: MEDIUM_SENTENCE_COLOR_DEFAULT,
    longColor: LONG_SENTENCE_COLOR_DEFAULT,
    longParagraph: LONG_PARAGRAPH_DEFAULT
  }

  private readonly _settings = new BehaviorSubject<Settings>(this.SETTING_DEFAULT);
  readonly settings$ = this._settings.asObservable();
  get settings(): any {
    return this._settings.getValue();
  }
  set settings(val: any) {
    this._settings.next(val);
  }

  initSettings(){
    const settingsString = localStorage.getItem('settings');
    if(!settingsString){
      return;
    }
    const savedSettings: Settings = JSON.parse(settingsString);
    
    const settings: Settings = {
      ...this.SETTING_DEFAULT,
      ...this.tool.filterObject(savedSettings)
    }
    this.settings = settings;
  }

  constructor(private tool: ToolService){
    this.initSettings();
  }

}
