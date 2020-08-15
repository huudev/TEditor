import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { TextService } from '@shared/service/text.service';
import { DEBOUNCE_TIME_DEFAFULT } from '@shared/app.const';
import { debounceTime } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-text-info',
  templateUrl: './text-info.component.html',
  styleUrls: ['./text-info.component.scss']
})
export class TextInfoComponent implements OnInit, OnChanges {
  debounceTime = DEBOUNCE_TIME_DEFAFULT;
  @Input()
  text = '';
  sentences = 0;
  words = 0;
  @Input()
  keyword
  @Output()
  keywordChange = new EventEmitter<string>();
  keywordDensity = 0;
  keywordControl: FormControl;
  queue = {}

  constructor(
    private textService: TextService,
  ) { }

  ngOnInit(): void {
    this.keywordControl = new FormControl();
    this.keywordControl.valueChanges.pipe(
      untilDestroyed(this), debounceTime(this.debounceTime)
    ).subscribe((value: string) => {
      this.keyword = value;
      this.keywordChange.emit(value);
      this.updateKeyDensity(this.text, value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const timeOutId: number = setTimeout(() => {
      if (changes['text']) {
        this.updateCountWords(this.text);
        this.updateCountSentences(this.text);
      } else if (changes['keyword']) {
        this.keywordControl.setValue(this.keyword);
      }
      this.updateKeyDensity(this.text, this.keyword || '');
      delete this.queue[timeOutId];
    }, 0) as any
    this.queue[timeOutId] = true;
    // console.log(Object.keys(this.queue).length);
  }

  updateCountWords(text: string) {
    this.words = this.textService.countWord(text);
  }

  updateCountSentences(text: string) {
    this.sentences = this.textService.countSentence(text);
  }

  updateKeyDensity(text: string, key: string) {
    this.keywordDensity = this.textService.countKeyDensity(text, key, this.words);
  }
}
