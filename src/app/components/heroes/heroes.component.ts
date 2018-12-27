
import { Component, OnInit, Inject, HostBinding, AfterViewInit, ViewChild } from '@angular/core';
import { HeroService } from './heroes.service';
import { AdItem, slideToRight, LtsModelComponent, WafTreeNode } from '@shared';
import { apiUrl } from '@core';
import { NzIconService, NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  animations: [
    slideToRight
  ]
})
export class HeroesComponent implements OnInit, AfterViewInit {

  @HostBinding('@routerAnim') state;
  ads: AdItem[];
  isOpen = true;
  selectData = [];
  selected = [];
  result: boolean;
  size = "default";
  time = new Date();
  array = [ 1, 2, 3, 4 ];
  testSelected = [];
  menuData =  [];
  test;
  iconArray;
  iconSize;
  zoom:boolean = false;
  expandKeys = [ '100', '1001' ];
  value: string;
  nodes: WafTreeNode[] = [];
  ids = [];
  checkedZorro:any;
  ngZorroNodes = [];
  selectedNodes = ['0-2','0-1','0-3','0-4','0-6'];

  @ViewChild(LtsModelComponent) ltsModel: LtsModelComponent;

  constructor(
    private heroservice: HeroService,
    private _iconService: NzIconService,
    private message: NzMessageService,
    private modalService: NzModalService,
    @Inject(apiUrl) private url
  ) {
    console.log(url);
    this._iconService.fetchFromIconfont({
      scriptUrl: 'assets/fonts/fonts-lts/iconfont.js'
    });
  }

  ngOnInit() {

    for (let i = 0; i < 10; i++) {
      let node = null;
      if (i == 5) {
        node = new WafTreeNode('0-' + i, '测试' + i, [new WafTreeNode('1-0', '测试5-0'), new WafTreeNode('1-1', '测试5-1'), new WafTreeNode('1-2', '测试5-2')]);
      } else {
        node = new WafTreeNode('0-' + i, '测试' + i);
      }
      // this.nodes.push(node);
    }

    setTimeout(()=>{
      this.zoom = true;
    },2000);
    this.ads = this.heroservice.getAds();
    this.selected = [
      {label: "l21", value: "l21"},
      {label: "v31", value: "v31"},
      {label: "w32", value: "w32"},
      {label: "g16", value: "g16"},
      {label: "h17", value: "h17"},
      {label: "c12", value: "c12"},
      {label: "a10", value: "a10"},
      {label: "b11", value: "b11"},
      {label: "f15", value: "f15"}
    ];
    this.iconSize = '100px';
    this.iconArray = [
      {class: 'fh-qidong', style: {color: 'red'}},
      {class: 'fh-tingzhi', style: {color: 'yellow'}},
    ];

    console.time();
    for (let i = 10; i < 100; i++) {
      this.selectData.push(
        { label: i.toString(36) + i, value: i.toString(36) + i }
      );
    }
    console.timeEnd();

    // this.selected = [{label: "a10", value: "a10"},{label: "b11", value: "b11"},{label: "c12", value: "c12"},{label: "d13", value: "d13"}]
    // this.selected = this.selectData;
    for (let i = 0;i < 10; i ++) {
      let array = [];
      for (let i = 0;i < 6; i ++) {
        array.push({
          name: '用户管理二级菜单',
          children: [
            {name: '用户管理三级菜单'},
            {name: '用户管理三级菜单'},
            {name: '用户管理三级菜单'},
            {name: '用户管理三级菜单'}
          ]
        });
      }
      this.menuData.push(
        { name: '用户', children: array }
      );
    }
  }

  showConfirm(): void {
    this.modalService.success({
      nzTitle  : '确认删除模板?',
      nzContent: '此模板已设为常用模板，模板删除后，用户无法获取默认删除条件。',
      nzOnOk   : () => console.log('OK')
    });
  }

  createBasicMessage(): void {
    this.message.success('修改成功');
  }

  ngAfterViewInit(): void {
    // this.ltsModel.test = 12;
  }

  choseItem(event: Event): void {
    console.log(event);
  }

  getSelected(): void {
    console.log(this.selectedNodes);
    // console.log(this.ids);
    // console.log('select zorro', this.checkedZorro);
  }

  check(e) {
    this.result = e;
  }

  show() {
    console.log('show debug');
  }

  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date): void {
    console.log('onOk', result);
  }
}
