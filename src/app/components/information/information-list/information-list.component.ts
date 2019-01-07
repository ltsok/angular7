import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'information-list',
  templateUrl: './information-list.component.html',
  styleUrls: ['./information-list.component.scss']
})
export class InformationListComponent implements OnInit {

  // 当前页码
  pageIndex: number = 1;

  // 当前页显示条目数量
  pageSize: number = 7;

  // 显示总数
  total: number = 36;

  // 所有新闻列表
  allNewsList: any[] = [];

  // 当前显示新闻列表
  showNewsList: any[] = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 36; i++) {
      this.allNewsList.push({
        content: 'Racing car sprays burning fuel into crowd.',
      });
    }
    this.showNewsList = this.allNewsList.slice(0, this.pageSize);
  }


  jump(): void {
    this.showNewsList = this.allNewsList.slice(this.pageSize * (this.pageIndex - 1), this.pageSize * (this.pageIndex - 1) + this.pageSize);
  }

}
