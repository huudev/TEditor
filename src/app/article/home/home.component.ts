import { Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Article } from '@shared/model';
import { ArticleService } from '@shared/service';
import { ColumnItem } from '@core/model/column-item.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  checked = false;
  loading = true;

  listOfColumns: ColumnItem[] = [
    {
      name: 'Tiêu đề',
      sortOrder: null,
      sortFn: (a: Article, b: Article) => a.title.localeCompare(b.title)
    },
    {
      name: 'Mô tả',
      sortOrder: null,
      sortFn: (a: Article, b: Article) => a.descriptions.localeCompare(b.descriptions)
    },
    {
      name: 'Từ khóa',
      sortOrder: null,
      sortFn: (a: Article, b: Article) => (a.keyword || '').localeCompare((b.keyword || ''))
    },
    {
      name: 'Ngày tạo',
      sortOrder: null,
      sortFn: (a: Article, b: Article) => (a.createAt as number) - (b.createAt as number)
    },
    {
      name: 'Hành động',
    },
    // {
    //   name: 'Name',
    //   sortOrder: null,
    //   sortFn: (a: Article, b: Article) => a.name.localeCompare(b.name),
    //    filterMultiple: true,
    //    listOfFilter: [
    //      { text: 'Joe', value: 'Joe' },
    //      { text: 'Jim', value: 'Jim', byDefault: true }
    //    ],
    //   filterFn: (list: string[], item: Article) => list.some(name => item.name.indexOf(name) !== -1)
    // },
    // {
    //   name: 'Age',
    //   sortOrder: 'descend',
    //   sortFn: (a: Article, b: Article) => a.age - b.age,
    //   sortDirections: ['descend', null]
    // },
    // {
    //   name: 'Address',
    //   sortOrder: null,
    //   sortFn: (a: Article, b: Article) => a.address.length - b.address.length,
    //   filterMultiple: false,
    //   listOfFilter: [
    //     { text: 'London', value: 'London' },
    //     { text: 'Sidney', value: 'Sidney' }
    //   ],
    //   filterFn: (address: string, item: Article) => item.address.indexOf(address) !== -1
    // }
  ];
  indeterminate = false;

  listOfData: Article[] = [];
  listOfCurrentPageData: Article[] = [];
  setOfCheckedId = new Set<string>();

  constructor(
    private message: NzMessageService,
    private articleService: ArticleService) { }

  ngOnInit(): void {
    this.articleService.getAll().pipe(untilDestroyed(this)).subscribe(articles => {
      this.listOfData = articles;
      this.loading = false;
    });
  }


  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Article[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loading = true;
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    console.log(requestData);
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }

  deleteArticle(id: string) {
    this.articleService.delete(id)
      .then(() => this.message.success('Xóa thành công'))
      .catch(() => this.message.error('Xóa thất bại'))
  }

}
