import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demonstration',
  templateUrl: './demonstration.component.html',
  styleUrls: ['./demonstration.component.scss']
})
export class DemonstrationComponent implements OnInit {

  // 当前页码
  pageIndex:number = 1;
  
  // 当前页显示条目数量
  pageSize:number = 8;

  // 显示总数
  total:number = 38;

  // 所有图片列表
  allImgList:any[] = [];

  // 当前显示图片列表
  showImgList:any[] = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 38; i++) {
      this.allImgList.push({
        src: 'assets/img/qingmu/kobi.jpg',
        alt: 'kobi'
      });
    }
    this.showImgList = this.allImgList.slice(0,this.pageSize);
  }

  jump(): void {
    this.showImgList = this.allImgList.slice(this.pageSize * ( this.pageIndex - 1), this.pageSize * ( this.pageIndex - 1) + this.pageSize);
  }

}
