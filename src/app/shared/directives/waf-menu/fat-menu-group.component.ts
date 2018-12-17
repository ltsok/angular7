import { Component, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { FatMenuGroupItemComponent } from './fat-menu-group-item.component';
import { WafMenuService } from './waf-menu.service';


/**
 * 二级菜单
 * @export
 * @class FatMenuGroupComponent
 * @implements {AfterContentInit}
 */
@Component({
  selector: 'fat-menu-group',
  template: `
    <li class="third-item">
      <ul class="third-item-container">
        <li class="title">
          {{title}}
          <ng-content></ng-content>
        </li>
        <ng-content select="fat-menu-group-item"></ng-content>
      </ul>
    </li>
  `,
  styleUrls: ['./waf-menu.component.scss']
})

export class FatMenuGroupComponent implements AfterContentInit {

  /** 输入二级菜单名称 */
  @Input()
  title: string;

  /** ng-content内投射的组件集合 */
  @ContentChildren(FatMenuGroupItemComponent)
  childrenCpm: QueryList<FatMenuGroupItemComponent>

  /** 父级菜单id */
  public parentId: string;


  /**
   * 构造函数
   * @param {WafMenuService} wafMenuService
   * @memberof FatMenuGroupComponent
   */
  constructor(private wafMenuService: WafMenuService) {
  }

  ngAfterContentInit(): void {

    // 为三级菜单组件设置父级id
    setTimeout(()=>{
      this.childrenCpm.forEach((item: FatMenuGroupItemComponent, index: number, array: FatMenuGroupItemComponent[])=>{
        array[index].parentId = this.parentId;
      });
    });
  }

}
