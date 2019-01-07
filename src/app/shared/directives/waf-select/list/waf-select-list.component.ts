import { Component, OnInit, Input, forwardRef, ViewChild, OnChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { WafSelectComponent } from '../waf-select.component';


/**
 * @export
 * @class WafSelectListComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'waf-select-list',
  templateUrl: './waf-select-list.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WafSelectListComponent),
      multi: true
    }
  ],
  styleUrls: ['./waf-select-list.component.scss']
})
export class WafSelectListComponent implements OnChanges {

  /** 输入数据 */
  @Input()
  set data(_data: Object[]) {
    if (Array.isArray(_data) && _data.length) {
      //默认使用第一项作为验证
      this.dataSource = _data;
    }
  }

  @ViewChild(WafSelectComponent)
  wafSelectComponent: WafSelectComponent;

  /** 输入数据源 */
  dataSource = [];

  /** 下拉所有选项数据 */
  allOptions: any[] = [];

  /** 已选中项 */
  selectedOptions: any[] = [];

  /** 定义空函数,在view => model变化时被赋值 */
  private onChange: (value: string | string[]) => void = () => null;

  private onTouched: () => void = () => null;

  ngOnChanges(): void {

    // 格式化数据源
    console.log(this.dataSource);
    this.formatData();
  }

  /**
   * 格式化数据
   * @memberof WafMultiselectComponent
   */
  formatData(): void {

    // dataSource格式化
    if (this.dataSource.length) {
      this.allOptions = [];
      this.dataSource.map((item) => {
        this.allOptions.push(
          { label: item.label, value: item.value, selected: false, showOptions: true, showSearch: true }
        );
      });
    }
  }


  /**
   * 下拉框选项点击事件
   * @param {number} index
   * @param {Event} event
   * @param {string} type
   * @memberof WafSelectListComponent
   */
  clickItem(index: number, event: Event, type: string): void {
    this.wafSelectComponent.choseItem(index, event, type);
  }


  /**
   * 子组件向父组件发射值，同步到ngModel双向绑定
   * @param {*} items
   * @memberof WafSelectListComponent
   */
  chosedItem(items: any): void {
    this.onChange(items);
  }

  /**
   * model=>view
   * 此方法用于父组件设置value到本组件中时angular自动调用
   * @param {*} value
   * @memberof WafInputComponent
   */
  writeValue(value: any[]) {
    if (value && value.length) {
      value.map((item) => {
        this.selectedOptions.push(
          { label: item.label, value: item.value, selected: true, showOptions: true, showSearch: true }
        );
        this.allOptions.forEach((options, index, arr) => {
          if (options.value === item.label) {
            arr[index].selected = true;
          }
        });
      })
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
