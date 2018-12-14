import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, forwardRef, Input } from '@angular/core';
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
    ]),
    trigger('arrowAnimation', [
      state('up', style({
        transform: 'rotateZ(180deg)'
      })),
      state('down', style({
        transform: 'rotateZ(0deg)'
      })),
      transition('up <=> down', [
        animate('300ms ease-in-out')
      ]),
    ])
  ],
})
export class WafMultiselectComponent implements OnInit {

  /** 输入数据 */
  @Input()
  set data(_data: Object[]) {
    if (Array.isArray(_data) && _data.length) {
      //默认使用第一项作为验证
      this.dataSource = _data;
    }
  }

  /** 下拉框选中值 */
  private _selectValue: any[];

  /** 输入数据源 */
  dataSource = [];

  /** 整个容器元素 */
  @ViewChild('seletcContainer')
  seletctEle: ElementRef;

  /** 下拉框位置样式 */
  dropdownStyle: Object = {};

  /** 下拉框样式 */
  dropdownPosition: string = 'bottom';

  /** 汇总图标显示隐藏 */
  showSummary: boolean = false;

  /** 所有选项下拉框显示隐藏 */
  showDropdown: boolean = false;

  /** 已选中的选项下拉框显示隐藏 */
  showSelectedDropdown: boolean = false;

  /** 没有内容匹配搜索时的显示隐藏 */
  showAllMismatch: boolean = false;

  /** 没有内容匹配搜索时的显示隐藏 */
  showSelectedMismatch: boolean = false;
  
  /** 所有已选中的下拉选项 */
  listOfOptions = [];

  /** 所有下拉选项 */
  selectOptions = [];

  /** 所有选项搜索 */
  searchAll: string;

  /** 在已选择的选项中搜索 */
  searchSelected: string;

  /** 定义空函数,在view => model变化时被赋值 */
  private onChange: (value: string | string[]) => void = () => null;

  private onTouched: () => void = () => null;


  /**
   * 构造函数
   * @param {Renderer2} render
   * @memberof WafMultiselectComponent
   */
  constructor(
    private render: Renderer2
  ) { }

  ngOnInit() {

    // 格式化数据源
    this.formatData();
  }

  ngAfterViewInit(): void {

    // dom的点击事件,隐藏下拉框
    this.domClick();

    // 页面滚动时下拉框的位置
    window.addEventListener('scroll', ()=>{
      this.calcDropdownPosition();
    });
  }

  /**
   * 格式化数据
   * @memberof WafMultiselectComponent
   */
  formatData(): void {
    
    // dataSource格式化到selectOptions中
    if ( this.dataSource.length ) {
      this.dataSource.map((item)=>{
        this.selectOptions.push(
          { label: item.label, value: item.value, selected: false, showOptions: true, showSearch: true }
        );
      });
    }
  }
  
  /**
   * 下拉框选中事件
   * @param {number} index
   * @param {string} type
   * @param {*} event
   * @memberof WafMultiselectComponent
   */
  choseItem(index: number, event: any, type: string): void {

    // 阻止事件冒泡
    event.stopPropagation();
    
    // 区分不同下拉框的点击事件
    switch(type) {

      // input框中选项消除
      case 'inputOptions':

        // input框中取消选中,只操作已选项
        this.listOfOptions[index].selected = !this.listOfOptions[index].selected;
        this.listOfOptions = this.listOfOptions.filter((v: any)=>{
          return v.selected === true;
        });

        // 选中结果同步到所有选项
        this.selectOptions.forEach((item, index, arr)=>{
          let isFind:boolean = false;
          this.listOfOptions.forEach((v)=>{
            if ( item.value === v.value ) {
              isFind = true;
            }
          });
          arr[index].selected = isFind ? true : false;
        });
      break;

      // 下拉框中选中、取消
      case 'select':

        // 点击所有选项的下拉框
        if (this.showDropdown) {
          
          // 选中、取消取反
          this.selectOptions[index].selected = !this.selectOptions[index].selected;
          if (this.selectOptions[index].selected) {
            this.listOfOptions.push(this.selectOptions[index]);
          } else {
            for (let i = 0;i < this.listOfOptions.length; i ++) {
              if ( this.listOfOptions[i].value === this.selectOptions[index].value ) {
                this.listOfOptions.splice(i,1);
                break;
              }
            }
          }
        
        }

        // 点击已选中的下拉框
        if (this.showSelectedDropdown) {

          // 选中、取消取反
          this.listOfOptions[index].selected = !this.listOfOptions[index].selected;
          this.listOfOptions = this.listOfOptions.filter((v: any)=>{
            return v.selected === true;
          });

          // 选中结果同步到所有选项
          this.selectOptions.forEach((item, index, arr)=>{
            let isFind:boolean = false;
            this.listOfOptions.forEach((v)=>{
              if ( item.value === v.value ) {
                isFind = true;
              }
            });
            arr[index].selected = isFind ? true : false;
          });
            
        }
      break;
    }
    
    this.showLabels();

    // 选中的数据双向绑定的数据中
    this._selectValue = this.objDeepCopy(this.listOfOptions);
    this._selectValue.forEach((item, index, arr)=>{
      delete arr[index].selected;
      delete arr[index].showOptions;
      delete arr[index].showSearch;
    });
    this.onChange(this._selectValue);
  }


  /**
   * 何时该显示标签
   * @memberof WafMultiselectComponent
   */
  showLabels(): void {

    // 容器宽度
    let containerWidth = parseInt($('#selectedContent').width());

    // 汇总标签宽度:文字宽度 + 图标宽度 + 图标margin + border + padding + 整体margin
    let summaryTagWidth = this.getCurrentBlockWidth(`已选择${this.listOfOptions.length}项`) + 14 + 8 + 2 + 14 + 4;

    // 箭头宽度
    let arrowWidth = 12;

    // 显示汇总标签后剩余显示宽度
    let remainWidth = containerWidth - arrowWidth - summaryTagWidth;

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
        item.showOptions = w > remainWidth ? false : true;
        return item;
      });
    } else {
      this.listOfOptions = this.listOfOptions.map((item)=>{
        item.showOptions = true;
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
    // 显示文字宽度最大设为320px
    let width = Math.round(currentObj.width() * 100) / 100 > 268 ? 268 : Math.round(currentObj.width() * 100) / 100;
    currentObj.remove();
    return width;
  }

  /**
   * 点击汇总标签展示下拉框
   * @param {*} event
   * @memberof WafMultiselectComponent
   */
  editSelected(event: any): void {

    // 阻止事件冒泡
    event.stopPropagation();

    this.calcDropdownPosition();

    // 页面上可能存在多个
    $('.select-dropdown-panel').hide();
    this.showDropdown = false;
    this.showSelectedDropdown = !this.showSelectedDropdown;
  }


  /**
   * 下拉框内容搜索
   * @param {string} type
   * @returns {void}
   * @memberof WafMultiselectComponent
   */
  search(type: string): void {
    switch(type) {
      case 'all':
        // 所有选项中搜索
        if ( this.searchAll ) {
          this.selectOptions = this.selectOptions.map((item)=>{
            item.showSearch = item.label.indexOf(this.searchAll) !== -1 ? true : false;
            return item;
          });
          // 是否显示没有匹配项的提示信息
          for (let i = 0; i < this.selectOptions.length; i ++) {
            if ( this.selectOptions[i].showSearch ) {
              this.showAllMismatch = false;
              return;
            }
          }
          this.showAllMismatch = true;
        } else {
          this.selectOptions = this.selectOptions.map((item)=>{
            item.showSearch = true;
            return item;
          });
          this.showAllMismatch = false;
        }
      break;
      case 'selected':
        // 已选中的选项中搜索
        if ( this.searchSelected ) {
          this.listOfOptions = this.listOfOptions.map((item)=>{
            item.showSearch = item.label.indexOf(this.searchSelected) !== -1 ? true : false;
            return item;
          });
          // 是否显示没有匹配项的提示信息
          for (let i = 0; i < this.listOfOptions.length; i ++) {
            if ( this.listOfOptions[i].showSearch ) {
              this.showSelectedMismatch = false;
              return;
            }
          }
          this.showSelectedMismatch = true;
        } else {
          this.listOfOptions = this.listOfOptions.map((item)=>{
            item.showSearch = true;
            return item;
          });
          this.showSelectedMismatch = false;
        }
      break;
    }
  }
  
  /**
   * 搜索框点击事件
   * @param {*} event
   * @param {string} type
   * @memberof WafMultiselectComponent
   */
  searchFocus(event: any, type: string): void {
    
    // 阻止事件冒泡
    event.stopPropagation();
    setTimeout(()=>{
      switch(type) {
        case 'all':
          this.showDropdown = true;
          this.showSelectedDropdown = false;
        break;
        case 'selected':
          this.showDropdown = false;
          this.showSelectedDropdown = true;
        break;
      }
      let className:String = this.seletctEle.nativeElement.className;
      if ( className.indexOf('select-border-color') !== -1 ) {
        this.render.removeClass(this.seletctEle.nativeElement, 'select-border-color');
      }
    });
  }

  /**
   * 添加select框在focus状态时的样式
   * @param {*} event
   * @memberof WafMultiselectComponent
   */
  inputFocus(event: any): void {

    // 阻止事件冒泡
    event.stopPropagation();

    // 页面上可能存在多个多选下拉框
    $('.select-dropdown-panel').hide();

    // 展开折叠
    this.showDropdown = !this.showDropdown;
    this.showSelectedDropdown = false;

    // input focus样式
    let className:String = this.seletctEle.nativeElement.className;
    if ( className.indexOf('select-border-color') === -1 ) {
      this.render.addClass(this.seletctEle.nativeElement, 'select-border-color');
    } else {
      this.render.removeClass(this.seletctEle.nativeElement, 'select-border-color');
    }

    this.calcDropdownPosition();
  }


  /**
   * 计算下拉框的位置
   * @memberof WafMultiselectComponent
   */
  calcDropdownPosition(): void {

    // 可视窗口高度
    let visibleViewHeight = window.innerHeight;

    // 窗口滚动的距离
    let windowScrollTop = $(window).scrollTop();

    // 元素距离窗口顶部距离
    let inputTop = this.seletctEle.nativeElement.offsetTop;

    // input框距离视口顶部距离
    let inputViewTop = inputTop - windowScrollTop;

    // 元素的高度
    let inputHeight = this.seletctEle.nativeElement.offsetHeight;

    // 可视窗口中元素距离页面底部的距离
    let inputToBottomHeight = visibleViewHeight - inputViewTop - inputHeight;

    // 下拉框所占的最大高度
    let dropDownMaxHeight = 232 + 5;

    // 若输入框下方可视区域够显示dropdown,则默认在下方，否则input元素在可视区的位置高于可视区一半的时候，下拉面板朝上显示，否则朝下显示
    if (inputToBottomHeight >= dropDownMaxHeight) {
      this.dropdownPosition = 'bottom';
    } else {
      this.dropdownPosition = visibleViewHeight - inputViewTop - inputHeight / 2 < visibleViewHeight / 2 ? 'top' : 'bottom';
    }

    // 计算下拉框在页面的位置
    if ( this.dropdownPosition === 'bottom' ) {
      this.dropdownStyle = {
        top: '30px',
        width: this.seletctEle.nativeElement.offsetWidth + 'px'
      };
    } else {
      this.dropdownStyle = {
        bottom: '30px',
        width: this.seletctEle.nativeElement.offsetWidth + 'px'
      };
    }
  }

  arrowDirection(): string {
    if ( this.showDropdown || this.showSelectedDropdown ) {
      return 'up'
    } else {
      return 'down'
    }
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


  /**
   * 通用深拷贝函数
   * @param {*} source
   * @returns
   * @memberof WafMultiselectComponent
   */
  objDeepCopy(source: any): any {
    let sourceCopy = source instanceof Array ? [] : {};
    for (let item in source) {
      sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
  }

  /**
   * model=>view
   * 此方法用于父组件设置value到本组件中时angular自动调用
   * @param {*} value
   * @memberof WafInputComponent
   */
  writeValue(value: any) {

    // 输入赋值
    if (Array.isArray(value) && value.length) {
      this._selectValue = value;
    } else {
      this._selectValue = [];
    }
    // 同步默认选中的值到下拉框中
    if ( Array.isArray(value) && value.length ) {
      this._selectValue.map((item)=>{
        this.listOfOptions.push(
          { label: item.label, value: item.value, selected: true, showOptions: true, showSearch: true }
        );
        this.selectOptions.forEach((options, index, arr)=>{
          if (options.value === item.label) {
            arr[index].selected = true;
          }
        });
      })

      // 标签是否显示判断
      this.showLabels();
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
