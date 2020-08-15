import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/database';

import * as firebase from 'firebase/app';

import { Article } from '../model/article.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TextService } from './text.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  readonly COLLECTION_NAME = 'articles'
  colRef: AngularFireList<Article>

  constructor(private db: AngularFireDatabase, private tool: TextService) {
    this.colRef = this.db.list(this.COLLECTION_NAME);
  }

  mapRawToModel(raw: SnapshotAction<Article>): Article {
    if (!raw.payload.exists()) {
      return null;
    }
    return ({ id: raw.payload.key, ...raw.payload.val() }) as Article;
  }

  mapRawsToModels(raws: SnapshotAction<Article>[]): Article[] {
    return raws.map(this.mapRawToModel);
  }

  save(article: Article): Promise<any> {
    article = JSON.parse(JSON.stringify(article));
    article['createAt'] = firebase.database.ServerValue.TIMESTAMP as any;
    return this.colRef.push(article);
  }

  getAll(): Observable<Article[]> {
    return this.colRef.snapshotChanges().pipe<Article[]>(map(this.mapRawsToModels.bind(this)));
  }

  getById(id: string): Observable<Article> {
    return this.db.object(this.COLLECTION_NAME + '/' + id).snapshotChanges().pipe(map(this.mapRawToModel));
  }

  getByTitle(title: string): Observable<Article[]> {
    const titleNormalized = this.tool.normalizeString(title);
    return this.db.list<Article>(this.COLLECTION_NAME, ref => ref.orderByChild('normalizedTitle').equalTo(titleNormalized))
      .snapshotChanges().pipe<Article[]>(map(this.mapRawsToModels.bind(this)));
  }

  update(article: Article): Promise<any> {
    article = JSON.parse(JSON.stringify(article));
    article['updateAt'] = firebase.database.ServerValue.TIMESTAMP as any;
    const id = article.id;
    delete article['id']
    return this.db.object(this.COLLECTION_NAME + '/' + id).update(article);
  }

  delete(id: string): Promise<any> {
    return this.db.object(this.COLLECTION_NAME + '/' + id).remove();
  }

}
