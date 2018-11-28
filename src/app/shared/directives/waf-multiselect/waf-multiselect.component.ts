import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, forwardRef } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as $ from 'jquery';

@Component({
  selector: 'waf-multiselect',
  templateUrl: './waf-multiselect.component.html',
  styleUrls: ['./waf-multiselect.component.scss'],
  providers          : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WafMultiselectComponent),
      multi      : true
    }
  ],
  animations         : [
    trigger('dropDownAnimation', [
      state('hidden', style({
        opacity: 0,
        display: 'none'
      })),
      state('bottom', style({
        opacity        : 1,
        transform      : 'scaleY(1)',
        transformOrigin: '0% 0%'
      })),
      state('top', style({
        opacity        : 1,
        transform      : 'scaleY(1)',
        transformOrigin: '0% 100%'
      })),
      transition('hidden => bottom', [
        style({
          opacity        : 0,
          transform      : 'scaleY(0.8)',
          transformOrigin: '0% 0%'
        }),
        animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)')
      ]),
      transition('bottom => hidden', [
        animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)', style({
          opacity        : 0,
          transform      : 'scaleY(0.8)',
          transformOrigin: '0% 0%'
        }))
      ]),
      transition('hidden => top', [
        style({
          opacity        : 0,
          transform      : 'scaleY(0.8)',
          transformOrigin: '0% 100%'
        }),
        animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)')
      ]),
      transition('top => hidden', [
        animate('100ms cubic-bezier(0.755, 0.05, 0.855, 0.06)', style({
          opacity        : 0,
          transform      : 'scaleY(0.8)',
          transformOrigin: '0% 100%'
        }))
      ])
    ])
  ],
})
export class WafMultiselectComponent implements OnInit {
 
  size = 'default';
  /** 获取整个容器 */
  @ViewChild('seletcContainer')
  seletctEle: ElementRef;

  /** 获取input元素 */
  @ViewChild('searchInput')
  inputEle: ElementRef;

  /** 汇总图标显示隐藏 */
  showSummary: boolean = false;

  /** 所有选项下拉框显示隐藏 */
  showDropdown: boolean = false;

  /** 已选中的选项下拉框显示隐藏 */
  showSelectedDropdown: boolean = false;
  
  /** 所有已选中的下拉选项 */
  listOfOptions = [];

  /** 所有下拉选项 */
  selectOptions = [];

  constructor(
    private render: Renderer2
  ) { }

  ngOnInit() {
    this.formatData();
  }

  ngAfterViewInit(): void {
    this.domClick();
  }

  /**
   * 格式化数据
   * @memberof WafMultiselectComponent
   */
  formatData(): void {
    const select = [];
    for (let i = 10; i < 110; i++) {
      select.push({ label: i.toString(36) + i, value: i.toString(36) + i, selected: false, showLabel: true });
    }
    this.selectOptions = select;
  }
  
  /**
   * 下拉框选中事件
   * @param {number} index
   * @param {string} type
   * @param {*} event
   * @memberof WafMultiselectComponent
   */
  choseItem(index: number, type: string, event: any): void {

    // 阻止事件冒泡
    event.stopPropagation();

    // 容器宽度
    let containerWidth = parseInt($('#selectedContent').width());
    
    // 汇总标签宽度:文字宽度 + 图标宽度 + 图标margin + border + padding + 整体margin
    let summaryTagWidth = this.getCurrentBlockWidth(`已选择${this.listOfOptions.length}项`) + 14 + 8 + 2 + 14 + 4;

    // 箭头宽度
    let arrowWidth = 12;

    // 显示汇总标签后剩余显示宽度
    let remainWidth = containerWidth - arrowWidth - summaryTagWidth;
    
    // 选中、取消取反
    if (type === 'all') {

      // 选中时不隐藏下拉框
      this.showDropdown = true;
      this.selectOptions[index].selected = !this.selectOptions[index].selected;
      this.listOfOptions = this.selectOptions.filter((v: any)=>{
        return v.selected === true;
      });
    } else {
      // 选中时不隐藏下拉框
      this.showSelectedDropdown = true;
      this.listOfOptions[index].selected = !this.listOfOptions[index].selected;
      this.listOfOptions = this.listOfOptions.filter((v: any)=>{
        return v.selected === true;
      });
    }
    
    // 点击后预计算填入内容占有的宽度
    let preInputWdiths: number = 0;
    
    this.listOfOptions.map((item)=>{
      preInputWdiths += this.getCurrentBlockWidth(item.label) + 30 + 2 + 4;
    });
    
    // 是否显示汇总标签
    this.showSummary = (preInputWdiths >= (containerWidth - arrowWidth)) ? true : false;

    // 显示汇总标签时，input区域内容显示方式
    if (this.showSummary) {
      let w: number = 0;
      this.listOfOptions = this.listOfOptions.map((item)=>{
        w += this.getCurrentBlockWidth(item.label) + 30 + 2 + 4;
        item.showLabel = w > remainWidth ? false : true;
        return item;
      });
    } else {
      this.listOfOptions = this.listOfOptions.map((item)=>{
        item.showLabel = true;
        return item;
      });
    }
  }

  /**
   * 获取输入容器子元素所占的空间,不包含搜索内容框,汇总项框
   * @returns {number}
   * @memberof WafMultiselectComponent
   */
  getInputContentWidth(): number {
    let childsWidthSum:number = 0;
    $('#selectedContent').find('li:not(.search-input,.select-edit)').each(function(){
      childsWidthSum += $(this).outerWidth(true);
    });
    return Math.round(childsWidthSum * 100) / 100;
  }

  /**
   * 获取每个填入选项的宽度
   * @param {string} text
   * @returns {number}
   * @memberof WafMultiselectComponent
   */
  getCurrentBlockWidth(text: string): number {
    let currentObj = $('<span>').hide().appendTo(document.body);
    $(currentObj).html(text)
    let width = Math.round(currentObj.width() * 100) / 100;
    currentObj.remove();
    return width;
  }

  editSelected(event: any): void {

    // 阻止事件冒泡
    event.stopPropagation();
    this.showDropdown = false;
    this.showSelectedDropdown = !this.showSelectedDropdown;
  }

  /**
   * 添加select框在focus状态时的样式
   * @param {*} event
   * @memberof WafMultiselectComponent
   */
  searchFocus(event: any): void {

    // 阻止事件冒泡
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    this.showSelectedDropdown = false;
    let className:String = this.seletctEle.nativeElement.className;
    if ( className.indexOf('select-border-color') === -1 ) {
      this.render.addClass(this.seletctEle.nativeElement, 'select-border-color');
    } else {
      this.render.removeClass(this.seletctEle.nativeElement, 'select-border-color');
    }

    // 让input处于focus状态
    this.inputEle.nativeElement.focus();
  }

  /**
   * 鼠标点击其他地方时,去除select框的focus样式,隐藏下拉框
   * @memberof WafMultiselectComponent
   */
  domClick(): void {
    document.addEventListener('click', (event:any) => {
      this.showDropdown = false;
      this.showSelectedDropdown = false;
      let className:String = this.seletctEle.nativeElement.className;
      if ( className.indexOf('select-border-color') !== -1 ) {
        this.render.removeClass(this.seletctEle.nativeElement, 'select-border-color');
      } else {
        return;
      }
    });
  }
}
