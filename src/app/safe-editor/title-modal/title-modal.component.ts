import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ArticleService } from '@shared/service/article.service';
import { map, take, switchMap, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StoreService } from '../store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-title-modal',
  templateUrl: './title-modal.component.html',
  styleUrls: ['./title-modal.component.scss']
})
export class TitleModalComponent implements OnInit, OnChanges {
  @Output()
  onSubmit = new EventEmitter<any>();

  titleForm: FormGroup;
  @Input()
  titleModel: string;
  @Input()
  originalTitle: string;

  titleFormSubmitSubject$: Subject<any>;

  constructor(
    public store: StoreService,
    private fb: FormBuilder,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.titleForm = this.fb.group({
      title: [this.titleModel, [Validators.required], this.titleAsyncValidator]
    });

    this.titleFormSubmitSubject$ = new Subject();

    this.titleFormSubmitSubject$
      .pipe(
        untilDestroyed(this),
        switchMap(() =>
          this.titleForm.statusChanges.pipe(
            // startWith(this.titleForm.status),
            filter(status => status !== 'PENDING'),
            take(1)
          )
        ),
        filter(status => status === 'VALID')
      )
      .subscribe(() => {
        this.onSubmit.emit(this.titleForm.value)
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['titleModel']) {
      this.titleForm?.patchValue({ title: this.titleModel });
    }
  }

  titleAsyncValidator = (control: FormControl) => {
    return this.articleService.getByTitle(control.value)
      .pipe(take(1), map(artiles => {
        if (artiles.length > 0) {
          if (this.originalTitle == control.value) {
            return null;
          }
          return { error: true, duplicated: true };
        } else
          return null;
      }))
  }

  updateTitleForm() {
    for (const key in this.titleForm.controls) {
      this.titleForm.controls[key].markAsDirty();
      this.titleForm.controls[key].updateValueAndValidity();
    }
  }

  titleModalOk() {
    this.updateTitleForm();
    this.titleFormSubmitSubject$.next();
  }

  titleModalCancel() {
    this.store.titleModalVisible = false;
  }
}