import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { combineLatest, ReplaySubject, Subject, throwError } from 'rxjs';
import { debounceTime, delayWhen, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DEBOUNCE_TIME_DEFAFULT, SENTENCE_WORD_SEPARATOR, TITLE_ARTICLE_DEFAULT } from '@shared/app.const';
import { Article } from '@shared/model/article.model';
import { ArticleService } from '@shared/service/article.service';
import { TextService } from '@shared/service/text.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AnimationOptions } from 'ngx-lottie';
import Quill from 'quill';

import { Settings } from '../model/settings.model';
import { StoreService } from '../store.service';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, CanDeactivate<any> {
  pageLoading = true;
  noData = false;
  isCreateMode = true;
  debounceTime = DEBOUNCE_TIME_DEFAFULT;

  options: AnimationOptions = {
    path: '/assets/anim-json/629-empty-box.json',
  };

  editor: Quill
  editorControl: FormControl;
  modules = null && {
    clipboard: {
      matchers: [
        [Node.TEXT_NODE, (node, delta) => {
          return delta
        }]
      ]
    }
  }
  leastIndex = 0;
  editorInitSub$: Subject<any> = new ReplaySubject(1);
  onContentChangedSub$: Subject<any> = new Subject();

  longSentenceWarningControl: FormControl;
  longParagraphWarningControl: FormControl;

  sentenceSeparator = SENTENCE_WORD_SEPARATOR;

  drawerSetingsVisible = false;

  text = '';
  key: string
  titleModel = TITLE_ARTICLE_DEFAULT;
  articleModel: Article;
  settings: Settings;

  constructor(
    private store: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private textService: TextService,
    private articleService: ArticleService) { }

  ngOnInit(): void {
    this.handlerParam();
    this.onContentChangedSub$.pipe(
      untilDestroyed(this),
      debounceTime(this.debounceTime),
      distinctUntilChanged((event1, event2) => event1.html == event2.html)
    ).subscribe(event => {
      this.onContentChanged(event);
    });
    this.store.settings$.pipe(
      untilDestroyed(this),
      delayWhen(() => this.editorInitSub$),
    ).subscribe(settings => {
      this.settings = settings;
      this.handlerAction();
    });

    this.longSentenceWarningControl = new FormControl(true);
    this.longSentenceWarningControl.valueChanges.pipe(untilDestroyed(this))
      .subscribe(longSentenceWarning => {
        if (longSentenceWarning) {
          this.detectLongSentence();
        } else {
          this.clearBackground();
        }
      })
    this.longParagraphWarningControl = new FormControl(true);
    this.longParagraphWarningControl.valueChanges.pipe(untilDestroyed(this))
      .subscribe(longParagraphWarning => {
        if (longParagraphWarning) {
          this.detectLongParagraph();
        } else {
          this.clearBlockquote();
        }
      })

    this.editorControl = new FormControl();
  }

  handlerParam() {
    const routeData$ = combineLatest(
      [
        this.route.data,
        this.route.paramMap.pipe(map(params => params.get('id')))
      ])
    routeData$.pipe(
      untilDestroyed(this),
      delayWhen(() => this.editorInitSub$),
      map(([{ isCreateMode }, id]) => ({ isCreateMode, id })),
      tap(({ isCreateMode, id }) => {
        this.noData = false;
        this.isCreateMode = isCreateMode;
        this.pageLoading = !isCreateMode;
      }),
      filter(({ isCreateMode, id }) => isCreateMode == false),
      switchMap(({ isCreateMode, id }) => {
        if (!id) {
          return throwError('article is invalid');
        } else {
          return this.articleService.getById(id);
        }
      })
    ).subscribe(aricle => {
      if (aricle == null) {
        this.handlerError();
      } else {
        this.pageLoading = false;
        this.articleModel = aricle;
        this.titleModel = aricle.title;
        this.editor.setContents(JSON.parse(aricle.content), 'user');
        this.editorControl.markAsPristine();
        this.key = aricle.key
      }
    }, () => {
      this.handlerError();
    });
  }

  handlerError() {
    // this.message.error('Địa chỉ bài đăng không hợp lệ');
    // this.router.navigate(['/'])
    this.pageLoading = false;
    this.noData = true;
  }

  onEditorCreated(event) {
    this.editor = event;
    this.editorInitSub$.next();
    this.addKeyBinding();
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

  handlerAction() {
    if (this.longSentenceWarningControl.value) {
      this.detectLongSentence();
    }
    if (this.longParagraphWarningControl.value) {
      this.detectLongParagraph();
    }
  }

  onSelectionChanged(event) {
    // console.log(event.range);
  }

  onContentChangedWrap(event) {
    if (event.source != 'api') {
      this.onContentChangedSub$.next(event)
    }
  }
  onContentChanged(event) {
    this.text = this.editor.getText();
    this.handlerAction();
  }

  clearBackground() {
    const textLength = this.editor.getLength();
    this.editor.formatText(0, textLength - 1, { 'background': false })
  }

  detectLongSentence() {
    // return;
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

  test() {
  }

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

  onSaveEditor() {
    const text = this.editor.getText();
    if (text.trim() == '') {
      this.message.error('Hãy nhập nội dung bài viết');
      return;
    }
    this.store.titleModalVisible = true;
  }

  saveArtice({ title }) {
    this.store.articleSaveLoading = true;
    const text = this.editor.getText();
    this.titleModel = title;
    const article: Article = {
      title: title,
      normalizedTitle: this.textService.normalizeString(title),
      content: JSON.stringify(this.editor.getContents()),
      descriptions: text.substr(0, Math.min(text.length, 100)),
      key: this.key
    }

    if (this.isCreateMode) {
      this.articleService.save(article)
        .then(({ key }) => {
          this.message.success('Lưu thành công');
          this.skipCheckDeactivate = true;
          this.editorControl.markAsPristine();
          this.router.navigate(['/safe-editor', key], { replaceUrl: true })
        })
        .catch(() => this.message.error('Lưu thất bại'))
        .finally(() => {
          this.store.articleSaveLoading = false;
          this.store.titleModalVisible = false;
        })
    } else {
      article.id = this.articleModel.id;
      this.articleService.update(article)
        .then(() => {
          this.message.success('Lưu thành công');
          this.articleModel = article;
          this.editorControl.markAsPristine();
        })
        .catch(() => this.message.error('Lưu thất bại'))
        .finally(() => {
          this.store.articleSaveLoading = false;
          this.store.titleModalVisible = false;
        })
    }
  }

  skipCheckDeactivate = false;
  checkDeactive(): boolean {
    if (this.skipCheckDeactivate) {
      return true;
    }
    if (!this.editorControl.dirty) {
      return true;
    } else if (this.isCreateMode && this.editor.getText().trim() == '') {
      return true;
    }
    return false;
  }
  canDeactivate(nextUrl: string): boolean {
    if (this.checkDeactive()) return true;
    const modal: NzModalRef = this.modal.create({
      nzCancelText: 'Hủy',
      nzContent: 'Hãy lưu trước khi rời khỏi trang này',
      nzOkText: 'Đồng ý',
      nzOkType: 'primary',
      nzTitle: 'Bài viết của bạn chưa lưu',
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modal.destroy()
        },
        {
          label: 'Không lưu',
          onClick: () => {
            this.skipCheckDeactivate = true;
            modal.destroy();
            this.router.navigate([nextUrl])
          }
        },
        {
          label: 'Lưu',
          type: 'primary',
          onClick: () => {
            modal.destroy();
            this.onSaveEditor();
          }
        },
      ]
    })
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    return this.checkDeactive();
  }

  openSetingsDrawer() {
    this.store.setingsDrawerVisible = true;
  }
}