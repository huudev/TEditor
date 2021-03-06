import { SaveArticle } from './../../action/home.action';
import { MediatorService } from './../../service/mediator.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Article } from '@shared/model';
import { ArticleService } from '@shared/service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AnimationOptions } from 'ngx-lottie';
import { Select, Store, Actions, ofActionDispatched } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { HomeState } from '../../state/home.state';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { ShowTitleModal, InitArticle, ShowSetingsDrawer, PreSaveArticle } from '../../action/home.action';
import { EditorState } from '@app/safe-editor/state/editor.state';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MediatorService]
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
    private articleService: ArticleService,
    private actions$: Actions,
    private mediatorService: MediatorService) { }
  ngOnInit(): void {
    this.handlerParam();
    this.actions$.pipe(
      ofActionDispatched(PreSaveArticle),
      switchMap(() => this.mediatorService.executeTask()),
      switchMap(() => this.store.dispatch(new SaveArticle())),
      untilDestroyed(this)
    ).subscribe();
  }

  handlerParam() {
    this.route.data.pipe(
      map(data => data.isCreateMode),
      tap(isCreateMode => {
        this.noData = false;
        this.isCreateMode = isCreateMode;
        if (isCreateMode) {
          this.pageLoading = false;
          this.initArticle()
        } else {
          this.pageLoading = true;
        }
      }),
      filter(isCreateMode => isCreateMode == false),
      switchMap(() => this.route.paramMap.pipe(map(params => params.get('id')))),
      switchMap(id => {
        if (!id) {
          return throwError('article is invalid');
        } else {
          return this.articleService.getById(id);
        }
      }),
      tap(() => this.pageLoading = false, () => this.pageLoading = false),
      untilDestroyed(this)
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
  checkCanDeactive() {
    if (this.skipCheckDeactivate) {
      return true;
    }
    // if not dirty that accept
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

  canDeactivate(nextUrl?: string): boolean {
    if (this.checkCanDeactive()) return true;
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
            this.router.navigate([nextUrl || '/'])
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
    return this.canDeactivate();
  }

  @Dispatch()
  openSetingsDrawer = () => new ShowSetingsDrawer()
}