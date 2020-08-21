import { take } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class MediatorService implements OnDestroy {
    listTaskForPreviousSaveArticle: (() => Observable<void>)[] = [];

    addTask(task: () => Observable<void>) {
        this.listTaskForPreviousSaveArticle.push(task)
    }

    executeTask() {
        const listTask$ = this.listTaskForPreviousSaveArticle.map(task => task());
        return combineLatest(listTask$).pipe(take(1));
    }

    ngOnDestroy(): void {
        this.listTaskForPreviousSaveArticle = []
    }

}