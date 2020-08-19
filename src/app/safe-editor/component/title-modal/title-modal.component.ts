import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, take, switchMap, filter, combineLatest } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { ArticleService } from '@shared/service';
import { ChangeTitle, SaveArticle, CloseTitleModal, PreSaveArticle } from '../../action/home.action';
import { Select } from '@ngxs/store';
import { HomeState } from '../../state/home.state';
import { ARTICLE_TITLE_DEFAULT } from '@shared/app.const';

@UntilDestroy()
@Component({
  selector: 'app-title-modal',
  templateUrl: './title-modal.component.html',
  styleUrls: ['./title-modal.component.scss']
})
export class TitleModalComponent implements OnInit {
  @Select(HomeState.titleModalVisible)
  visible$: Observable<boolean>
  @Select(HomeState.articleSaving)
  articleSaving$: Observable<boolean>

  form: FormGroup;
  @Select(HomeState.title)
  title$: Observable<string>;
  @Select(HomeState.originalTitle)
  originalTitle$: Observable<string>;

  formSubmitSubject$: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [ARTICLE_TITLE_DEFAULT, [Validators.required], this.titleAsyncValidator]
    });
    this.title$.pipe(untilDestroyed(this)).subscribe(title => this.form.patchValue({ title: title || ARTICLE_TITLE_DEFAULT }))

    this.formSubmitSubject$ = new Subject();
    this.formSubmitSubject$
      .pipe(
        untilDestroyed(this),
        switchMap(() =>
          this.form.statusChanges.pipe(
            // startWith(this.form.status),
            filter(status => status !== 'PENDING'),
            take(1)
          )
        ),
        filter(status => status === 'VALID')
      )
      .subscribe(() => {
        this.changeTitle(this.form.value.title);
        this.preSaveAricle()
      });
  }

  titleAsyncValidator = (control: FormControl) => {
    return this.articleService.getByTitle(control.value)
      .pipe(combineLatest(this.originalTitle$), take(1),
        map(([artiles, originalTitle]) => {
          if (artiles.length > 0) {
            if (originalTitle == control.value) {
              return null;
            }
            return { error: true, duplicated: true };
          } else
            return null;
        }))
  }

  updateform() {
    for (const key in this.form.controls) {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    }
  }

  submit(x) {
    this.updateform();
    this.formSubmitSubject$.next();
  }

  @Dispatch()
  changeTitle = (title: string) => new ChangeTitle(title)

  @Dispatch()
  preSaveAricle = () => new PreSaveArticle()

  @Dispatch()
  close = () => new CloseTitleModal()
}