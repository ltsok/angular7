import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, forwardRef } from '@angular/core';
import { WafTreeNode } from '../../waf-tree/model/waf-tree.node';
import { WafSelectComponent } from '../waf-select.component';
import { WafTreeComponent } from '../../waf-tree/waf-tree.component';


/**
 * @export
 * @class WafSelectTreeComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'waf-select-tree',
  templateUrl: './waf-select-tree.component.html',
  styleUrls: ['./waf-select-tree.component.scss'],
  providers          : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WafSelectTreeComponent),
      multi      : true
    }
  ],
})
export class WafSelectTreeComponent implements OnInit {

  /** 输入数据 */
  @Input()
  set data(_data: WafTreeNode[]) {
    if (Array.isArray(_data) && _data.length) {
      //默认使用第一项作为验证
      this.dataSource = _data;
    }
  }

  @ViewChild(WafSelectComponent)
  wafSelectComponent: WafSelectComponent;

  @ViewChild(WafTreeComponent)
  wafTreeComponent: WafTreeComponent;

  /** 输入数据源 */
  dataSource: WafTreeNode[];

  /** 数据源扁平化 */
  flatDataSource: any[] = [];

  /** 默认已选中项 */
  selectedOptions: any[] = [];

  /** 搜索内容 */
  searchStr: string;

  /** 定义空函数,在view => model变化时被赋值 */
  private onChange: (value: string | string[]) => void = () => null;

  private onTouched: () => void = () => null;

  checkedItems = [];

  ngOnInit() {
    this.dataFlat(this.dataSource);
  }

  /** checkbox点击事件 */
  checkedChange(): void {
    this.selectedOptions = [];
    this.checkedItems.map((id)=>{
      let name = '';
      for (let i = 0; i < this.flatDataSource.length; i ++ ) {
        if (this.flatDataSource[i].id === id) {
          name = this.flatDataSource[i].name;
          break;
        }
      }
      this.selectedOptions.push(
        {label: name, value: id, selected: true, showOptions: true, showSearch: true }
      );
    });
    this.onChange(this.checkedItems);
  }

  
  /**
   * 节点树扁平化
   * @param {WafTreeNode[]} data
   * @memberof WafSelectTreeComponent
   */
  dataFlat(data: WafTreeNode[]): void {
    if (data && data.length) {
      data.forEach((item)=>{
        if ( item.children && item.children.length ) {
          this.flatDataSource.push(item);
          this.dataFlat(item.children);
        } else {
          this.flatDataSource.push(item);
        }
      });
    }
  }

  /** 已选中项目选中事件 */
  chosedItem(checkedArr: any[]): void {
    this.checkedItems = checkedArr.map((item)=>{
      return item.value;
    });
    this.checkedChange();
  }

  /** 搜索事件 */
  searchItem(mesgs: any): void {
    this.searchStr = mesgs;
  }

  /**
   * model=>view
   * 此方法用于父组件设置value到本组件中时angular自动调用
   * @param {*} value
   * @memberof WafInputComponent
   */
  writeValue(value: any[]) {
    if ( Array.isArray(value) && value.length ) {
      this.checkedItems = value;
      this.checkedChange();
    }
  }

  /**
   * view=>model
   * 此方法用于将本组件的html中的值发生变化时，调用fn方法将值传至父组件中
   * @param {((value: string | string[]) => void)} fn
   * @memberof WafInputComponent
   */
  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
