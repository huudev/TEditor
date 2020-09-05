import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { TextService } from '@shared/service';
import { DEBOUNCE_TIME_DEFAFULT } from '@shared/app.const';
import { debounceTime, withLatestFrom } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { HomeState } from '@app/safe-editor/state/home.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ChangeKeyword } from '@app/safe-editor/action/home.action';
import { EditorState } from '@app/safe-editor/state/editor.state';

@UntilDestroy()
@Component({
  selector: 'app-text-info',
  templateUrl: './text-info.component.html',
  styleUrls: ['./text-info.component.scss']
})
export class TextInfoComponent implements OnInit {
  debounceTime = DEBOUNCE_TIME_DEFAFULT;
  @Select(EditorState.text)
  text$: Observable<string>
  sentences = 0;
  words = 0;
  @Select(HomeState.keyword)
  keyword$: Observable<string>
  keyword: string
  keywordDensity = 0;
  keywordControl: FormControl;
  // queue = {}
  text: string;

  constructor(private textService: TextService) { }
  ngOnInit(): void {
    this.text$.pipe(untilDestroyed(this))
      .subscribe(text => {
        this.text = text;
        this.updateCountWords(text);
        this.updateCountSentences(text);
        this.updateKeyDensity();
      })
    this.keywordControl = new FormControl();
    this.keywordControl.valueChanges.pipe(debounceTime(this.debounceTime), untilDestroyed(this))
      .subscribe(keyword => {
        this.keyword = keyword;
        this.changeKeyword();
      });

    this.keyword$.pipe(untilDestroyed(this)).subscribe(keyword => {
      if (keyword) {
        this.keywordControl.setValue(keyword);
      }
    })
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   const timeOutId: number = setTimeout(() => {
  //     if (changes['text']) {
  //       this.updateCountWords(this.text);
  //       this.updateCountSentences(this.text);
  //     } else if (changes['keyword']) {
  //       this.keywordControl.setValue(this.keyword);
  //     }
  //     this.updateKeyDensity(this.text, this.keyword || '');
  //     delete this.queue[timeOutId];
  //   }, 0) as any
  //   this.queue[timeOutId] = true;
  //   // console.log(Object.keys(this.queue).length);
  // }

  @Dispatch()
  changeKeyword() {
    this.updateKeyDensity();
    return new ChangeKeyword(this.keyword);
  }

  updateCountWords(text: string) {
    this.words = this.textService.countWord(text);
  }

  updateCountSentences(text: string) {
    this.sentences = this.textService.countSentence(text);
  }

  updateKeyDensity() {
    this.keywordDensity = this.textService.countKeyDensity(this.text, this.keyword, this.words);
  }
}
