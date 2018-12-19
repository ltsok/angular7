import { Component, Input } from '@angular/core';

/**
 * 模块壳组件
 * @export
 * @class WafIconComponent
 */
@Component({
  selector: 'waf-icon',
  templateUrl: './waf-icon.component.html',
  styleUrls: ['./waf-icon.component.scss']
})

export class WafIconComponent {

  /** 输入图标数组 */
  @Input() set size(value: string) {
    this._size = value;
  }

  /** 输入图标数组 */
  @Input() set icons(iconArr: Array<any>) {
    if (Array.isArray(iconArr) && iconArr.length) {
      this.iconArray = iconArr;
    }
  }

  /** 输入动画效果 */
  @Input() set animate(value: string) {
    this._animate = value;
  }

  /** 图标数组 */
  iconArray: Array<any> = [];

  /** 图标大小 */
  _size: string;
  
  /** 图标动画 */
  _animate: string = '';

}
