import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { combineLatest, throwError, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Article } from '@shared/model';
import { ArticleService } from '@shared/service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AnimationOptions } from 'ngx-lottie';
import { Select, Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { HomeState } from '../../state/home.state';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { ShowTitleModal, InitArticle, ShowSetingsDrawer } from '../../action/home.action';
import { EditorState } from '@app/safe-editor/state/editor.state';

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

  options: AnimationOptions = {
    path: '/assets/anim-json/629-empty-box.json',
  };

  @Select(HomeState.title)
  articleTile$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private store: Store,
    private modal: NzModalService,
    private articleService: ArticleService) { }
  ngOnInit(): void {
    this.handlerParam();
  }

  handlerParam() {
    const routeData$ = combineLatest(
      [
        this.route.data.pipe(map(data => data.isCreateMode)),
        this.route.paramMap.pipe(map(params => params.get('id')))
      ])
    routeData$.pipe(
      untilDestroyed(this),
      tap(([isCreateMode, id]) => {
        this.noData = false;
        this.isCreateMode = isCreateMode;
        if (isCreateMode) {
          this.pageLoading = false;
          this.initArticle()
        } else {
          this.pageLoading = true;
        }
      }),
      filter(([isCreateMode, id]) => isCreateMode == false),
      switchMap(([isCreateMode, id]) => {
        if (!id) {
          return throwError('article is invalid');
        } else {
          return this.articleService.getById(id);
        }
      }),
      tap(() => this.pageLoading = false, () => this.pageLoading = false)
    ).subscribe(aricle => {
      if (aricle == null) {
        this.handlerError();
      } else {
        this.initArticle(aricle);
      }
    }, () => {
      this.handlerError();
    });
  }

  handlerError() {
    this.noData = true;
  }

  @Dispatch()
  initArticle = (article?: Article) => new InitArticle(this.isCreateMode, article)

  test() {
  }

  requestSave() {
    const text = this.store.selectSnapshot(EditorState.text);
    if (text.trim() == '') {
      this.message.error('Hãy nhập nội dung bài viết');
      return;
    }
    this.showTitleModel();
  }

  @Dispatch()
  showTitleModel = () => new ShowTitleModal()

  skipCheckDeactivate = false;
  checkDeactive() {
    if (this.skipCheckDeactivate) {
      return true;
    }
    const dirty = this.store.selectSnapshot(EditorState.isDirty);
    if (!dirty) {
      return true;
    }
    const text = this.store.selectSnapshot(EditorState.text);
    if (this.isCreateMode && text.trim() == '') {
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
            this.requestSave();
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

  @Dispatch()
  openSetingsDrawer = () => new ShowSetingsDrawer()
}