
import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { HeroService } from './heroes.service';
import { AdItem, slideToRight, WafTreeNode  } from '@shared';
import { apiUrl } from '@core';
import * as zTree from 'zTree';
import * as $ from 'jquery';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  animations: [
    slideToRight
  ]
})
export class HeroesComponent implements OnInit {

  @HostBinding('@routerAnim') state;
  ads: AdItem[];
  array = [1,2,3,4];
  selectData = [];
  selectedList = [
    // {label: "l21", value: "l21"},
    // {label: "v31", value: "v31"},
    // {label: "w32", value: "w32"},
    // {label: "g16", value: "g16"},
    // {label: "h17", value: "h17"},
    // {label: "c12", value: "c12"},
    // {label: "a10", value: "a10"},
    // {label: "b11", value: "b11"},
    // {label: "f15", value: "f15"}
    { label: [{name: 'a--10', width: '20%'},{name: 'a@@10', width: '20%'}], value: 'a10' }
  ];

  nodes = [];

  selectedNodes = ['0-2','0-1','0-3','0-4','0-6'];
  constructor(
    private heroservice: HeroService,
    @Inject(apiUrl) private url
  ) {
    console.log(url);
  }

  ngOnInit() {
    // this.ads = this.heroservice.getAds();
    for (let i = 10; i < 50; i++) {
      this.selectData.push(
        { label: [{name: i.toString(36) +'1111111111111111111' + '--' + i, width: '20%'},{name: i.toString(36) + '@@' + i, width: '20%'}], value: i.toString(36) + i }
        // { label: i.toString(36) + i, value: i.toString(36) + i }
      );
    }

    // 测试nodelist
    // for (let i = 0; i < 900; i++) {
    //   let node = null;
    //   // if (i == 5) {
    //     node = new WafTreeNode(
    //       '0-' + i, '测试' + i, 
    //       [new WafTreeNode(`${i}-0`, `测试${i}-0`), new WafTreeNode(`${i}-1`, `测试${i}-1`), new WafTreeNode(`${i}-2`, `测试${i}-2`)
    //     ]
    //     );
    //   // } else {
    //   //   node = new WafTreeNode('0-' + i, '测试' + i);
    //   // }
    //   this.nodes.push(node);
    // }

    
  }

  changeData(): void {
    // list
    // this.selectData = [];
    // this.selectedList = [];
    // for (let i = 20; i < 50; i++) {
    //   this.selectData.push(
    //     { label: [{name: i.toString(36) + '--' + i, width: '20%'},{name: i.toString(36) + '@@' + i, width: '20%'}], value: i.toString(36) + i }
    //     // { label: i.toString(36) + i, value: i.toString(36) + i }
    //   );
    // }

    // node
    // this.nodes = [];
    // for (let i = 0; i < 20; i++) {
    //   let node = null;
    //   if (i == 5) {
    //     node = new WafTreeNode('0-' + i, '测试' + i, [new WafTreeNode('1-0', '测试5-0'), new WafTreeNode('1-1', '测试5-1'), new WafTreeNode('1-2', '测试5-2')]);
    //   } else {
    //     node = new WafTreeNode('0-' + i, '测试' + i);
    //   }
    //   this.nodes.push(node);
    // }
    // this.selectedNodes = [];
  }

  getSelected(): void {
    console.log(this.selectedList);
  }

}
