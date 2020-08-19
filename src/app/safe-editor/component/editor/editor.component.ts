import { Component, OnInit, NgZone } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilKeyChanged, tap, mergeMap, delayWhen } from 'rxjs/operators';
import { DEBOUNCE_TIME_DEFAFULT, SENTENCE_WORD_SEPARATOR } from '@shared/app.const';
import Quill from 'quill';
import { FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TextService } from '@shared/service';
import { Select, ofActionDispatched, Actions, Store } from '@ngxs/store';
import { Settings } from '@app/safe-editor/model/settings.model';
import { EditorState } from '@app/safe-editor/state/editor.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ChangeText, ChangeIsDirty, } from '@app/safe-editor/action/editor.action';
import { PreSaveArticle, UpdateContent, SaveArticle } from '@app/safe-editor/action/home.action';

@UntilDestroy()
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  debounceTime = DEBOUNCE_TIME_DEFAFULT;
  modules = null && {
    clipboard: {
      matchers: [
        [Node.TEXT_NODE, (node, delta) => {
          return delta
        }]
      ]
    }
  }
  editor: Quill
  editorInit$: ReplaySubject<void>
  editorControl: FormControl
  onContentChangedSub$: Subject<any>

  sentenceSeparator = SENTENCE_WORD_SEPARATOR;

  isLatestSetContent: boolean = true;
  isDirty: boolean = false;
  @Select(EditorState.settings)
  settings$: Observable<Settings>
  settings: Settings;
  @Select(EditorState.longSentenceWarning)
  longSentenceWarning$: Observable<boolean>
  longSentenceWarning = true
  @Select(EditorState.longParagraphWarning)
  longParagraphWarning$: Observable<boolean>
  longParagraphWarning = false;
  @Select(EditorState.content)
  content$: Observable<string>

  constructor(
    private message: NzMessageService,
    private textService: TextService,
    private store: Store,
    private actions$: Actions) { }
  ngOnInit(): void {
    this.editorControl = new FormControl();
    this.onContentChangedSub$ = new Subject();
    this.actions$.pipe(untilDestroyed(this), ofActionDispatched(PreSaveArticle),
      mergeMap(() => this.store.dispatch(new UpdateContent(JSON.stringify(this.editor.getContents())))),
      mergeMap(() => this.store.dispatch(new SaveArticle()))
    ).subscribe(() => {
      this.changeIsDirty(false);
      this.editorControl.markAsPristine();
    });
    this.editorInit$ = new ReplaySubject(1);
    this.content$.pipe(untilDestroyed(this), delayWhen(() => this.editorInit$))
      .subscribe(content => {
        if (content) {
          this.editor.setContents(JSON.parse(content), 'user');
          this.isLatestSetContent = true;
        } else {
          this.editor.setText('');
          this.isLatestSetContent = false;
        }
        this.changeIsDirty(false);
        this.editorControl.markAsPristine();
      })
  }

  init(): void {
    this.onContentChangedSub$.pipe(
      untilDestroyed(this),
      debounceTime(this.debounceTime),
      distinctUntilKeyChanged('html')
    ).subscribe(supportControl => {
      this.changeText(this.editor.getText());
      if (this.isLatestSetContent) {
        this.isLatestSetContent = false;
      } else {
        this.changeIsDirty(true);
      }
      this.handlerSupport();
    });
    this.settings$.pipe(
      untilDestroyed(this),
    ).subscribe(settings => {
      this.settings = settings;
      this.handlerSupport();
    });
    this.longSentenceWarning$.pipe(untilDestroyed(this)).subscribe(longSentenceWarning => {
      this.longSentenceWarning = longSentenceWarning;
      if (longSentenceWarning) {
        this.detectLongSentence();
      } else {
        this.clearBackground();
      }
    })
    this.longParagraphWarning$.pipe(untilDestroyed(this)).subscribe(longParagraphWarning => {
      this.longParagraphWarning = longParagraphWarning;
      if (longParagraphWarning) {
        this.detectLongParagraph();
      } else {
        this.clearBlockquote();
      }
    })
  }

  handlerSupport() {
    if (this.longSentenceWarning) {
      this.detectLongSentence();
    }
    if (this.longParagraphWarning) {
      this.detectLongParagraph();
    }
  }

  changeIsDirty = (flag) => {
    if (this.isDirty != flag) {
      this.isDirty = flag;
      this.store.dispatch(new ChangeIsDirty(flag));
    }
  };

  capitalizeFirstLetterOfSentence() {
    const textLength = this.editor.getLength();
    let startIndex = 0;
    let index = 0;
    for (; index < textLength; ++index) {
      const char = this.editor.getText(index, 1);
      if (char == '.') {
        const nextChart = this.editor.getText(index + 1, 1);
        if (nextChart != ' ') {
          continue;
        }
      }
      if (this.sentenceSeparator.includes(char)) {
        let indexOfSentence = startIndex;
        while (indexOfSentence < index) {
          const char = this.editor.getText(indexOfSentence, 1);
          if (this.textService.isLetter(char)) {
            this.editor.deleteText(indexOfSentence, 1);
            this.editor.insertText(indexOfSentence, char.toUpperCase())
            break;
          }
          indexOfSentence++;
        }
        startIndex = index + 1;
      }
    }
    this.message.success('Đã viết hoa chữ đầu dòng!')
  }

  addKeyBinding() {
    (this.editor.keyboard as any).addBinding({
      key: '1',
      altKey: true,
      handler: (range, context) => {
        this.capitalizeFirstLetterOfSentence();
        return true;
      }
    });
  }

  onEditorCreated(event) {
    this.editor = event;
    this.init();
    this.editorInit$.next()
    this.addKeyBinding();
  }

  onSelectionChanged(event) {
    // console.log(event.range);
  }

  onContentChangedWrap(event) {
    if (event.source != 'api') {
      this.onContentChangedSub$.next(event)
    }
  }

  @Dispatch()
  changeText = (text: string) => new ChangeText(text)

  clearBackground() {
    const textLength = this.editor.getLength();
    this.editor.formatText(0, textLength - 1, { 'background': false })
  }

  detectLongSentence() {
    const textLength = this.editor.getLength();
    let startIndex = 0;
    let index = 0;
    for (; index < textLength; ++index) {
      const char = this.editor.getText(index, 1);
      if (char == '.') {
        const nextChart = this.editor.getText(index + 1, 1);
        if (nextChart != ' ') {
          continue;
        }
      }
      if (this.sentenceSeparator.includes(char)) {
        this.markWords(index, 1);
        this.markWords(startIndex, index - startIndex);
        startIndex = index + 1;
      }
    }
    if (startIndex < textLength - 1) {
      this.markWords(startIndex, textLength - startIndex);
    }
  }

  markWords(index: number, length: number) {
    const words: string = this.editor.getText(index, length);
    // console.log({'sentence':words});
    let wordsLength = this.textService.countWord(words);
    let backgroundOption;
    if (wordsLength < this.settings.range[0]) {
      backgroundOption = false;
    } else if (wordsLength < this.settings.range[1]) {
      backgroundOption = this.settings.mediumColor.value;
    } else {
      backgroundOption = this.settings.longColor.value;
    }

    this.editor.formatText(index, length, { 'background': backgroundOption });
    //this.editor.format('background', false);
  }

  detectLongParagraph() {
    const textLength = this.editor.getLength();
    let startIndex = 0;
    let index = 0;
    for (; index < textLength; ++index) {
      const char = this.editor.getText(index, 1);
      if (char == '\n') {
        this.markParagraph(startIndex, index - startIndex)
        startIndex = index + 1;
      }
    }
    if (startIndex < textLength - 1) {
      this.markParagraph(startIndex, index - startIndex)
    }
  }

  markParagraph(index: number, length: number) {
    const words: string = this.editor.getText(index, length);
    // console.log({'sentence':words});
    let wordsLength = this.textService.countWord(words);
    if (wordsLength > this.settings.longParagraph) {
      this.editor.formatLine(index, 1, { 'blockquote': true })
    } else {
      this.editor.formatLine(index, 1, { 'blockquote': false })
    }
  }

  clearBlockquote() {
    const textLength = this.editor.getLength();
    let startIndex = 0;
    let index = 0;
    for (; index < textLength; ++index) {
      const char = this.editor.getText(index, 1);
      if (char == '\n') {
        this.editor.formatLine(startIndex, 1, { 'blockquote': false })
        startIndex = index + 1;
      }
    }
    if (startIndex < textLength - 1) {
      this.editor.formatLine(startIndex, 1, { 'blockquote': false })
    }
  }
}