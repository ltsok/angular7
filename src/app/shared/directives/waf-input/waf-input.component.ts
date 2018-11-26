import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, Output, EventEmitter, forwardRef, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, interval } from 'rxjs';
import { switchMap, take, debounceTime } from 'rxjs/operators';

/** 默认正则 */
const regExps = {
  IPV4: `^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$`,
  IPV6: `^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$`,
  maskIPV4: ``,
  maskIPV6: ``,
  phone: ``,
  mail: ``
};

/** 默认图标 */
const defaultIconUrl = {
  IPV4: '/assets/img/unm/change_ipv4.png',
  IPV6: '/assets/img/unm/change_ipv6.png',
};

@Component({
  selector: 'waf-input',
  templateUrl: './waf-input.component.html',
  styleUrls: ['./waf-input.component.scss'],
  animations: [
    trigger('v4ShowToV4Hide', [
      state('v4Show', style({
        transform: 'rotateY(0deg)'
      })),
      state('V4Hide', style({
        transform: 'rotateY(-180deg)'
      })),
      transition('v4Show <=> V4Hide', [
        animate('.5s ease-in-out')
      ])
    ]),
    trigger('v6HideToV6Show', [
      state('v6Hide', style({
        transform: 'rotateY(-180deg)'
      })),
      state('V6Show', style({
        transform: 'rotateY(-360deg)'
      })),
      transition('v6Hide <=> V6Show', [
        animate('.5s ease-in-out')
      ])
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WafInputComponent),
      multi: true
    }
  ]
})


export class WafInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  /** 输入框类型 */
  @Input('type')
  inputType: string;

  /** 自定义icon */
  @Input()
  set iconUrl(url: string | string[]) {
    this._iconUrl = url;
  }

  @Input()
  set regExp(reg: string | string[]) {
    if (typeof (reg) === 'string') {
      this._regExp = new RegExp(reg);
    }
    if (Array.isArray(reg) && reg.length === 2) {
      //默认使用第一项作为验证
      this._regExp = new RegExp(reg[0]);
      this._regArray = reg;
    }
  }

  /** 图标背景 */
  _iconBackground: Object = {};

  /** 自定义图标路径 */
  _iconUrl: string | string[];

  /** 正则 */
  private regExps: RegExp;

  /** 输入正则 */
  private _regExp: RegExp;

  /** 输入正则数组 */
  private _regArray: string[];

  /** 校验结果 */
  private vertifiedResult: boolean = false;

  /** 提示信息 */
  private toolTip: string;

  /** 是否显示tooltip */
  private showTooltip: boolean;

  /** input输入值 */
  private _inputValue: string;

  /** 输入默认为IPV4 */
  private showIpv4: boolean = true;

  /** 输入框placeholder */
  private placeHolder: string;

  /** 邮箱后缀 */
  private mailSuffix: string[];

  /** 定义空函数,在view => model变化时被赋值 */
  private onChange: (value: string | string[]) => void = () => null;

  private onTouched: () => void = () => null;

  /** 获取input元素 */
  @ViewChild('wafInput')
  inputEle: ElementRef;

  set inputValue(v: any) {
    if (v !== this._inputValue) {
      this._inputValue = v;
      this.onChange(this._inputValue);
    }
  }

  get inputValue() {
    return this._inputValue;
  }

  ngOnInit(): void {
    this.initData();
  }

  ngAfterViewInit(): void {
    this.checkInputValue();
  }

  initData(): void {

    // 初始化placeholder、_regExp和_iconBackground
    switch (this.inputType) {
      case 'ipaddress':
        this.placeHolder = '0.0.0.0';
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.IPV4);
        if ( this._iconUrl && this._iconUrl.length === 2 ) {
          this._iconBackground = {
            IPV4: `url(${this._iconUrl[0]}) no-repeat`,
            IPV6: `url(${this._iconUrl[1]}) no-repeat`,
          };
        }
        break;
      case 'mask':
        this.placeHolder = '255.255.255.0';
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.maskIPV4);
        if ( this._iconUrl && this._iconUrl.length === 2 ) {
          this._iconBackground = {
            IPV4: `url(${this._iconUrl[0]}) no-repeat`,
            IPV6: `url(${this._iconUrl[1]}) no-repeat`,
          };
        }
        break;
      case 'phone':
        this.placeHolder = '';
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.phone);
        if ( this._iconUrl ) {
          this._iconBackground = {
            phone: `url(${this._iconUrl}) no-repeat`
          };
        }
        break;
      case 'mail':
        this.placeHolder = '';
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.mail);
        if ( this._iconUrl ) {
          this._iconBackground = {
            mail: `url(${this._iconUrl}) no-repeat`
          };
        }
        break;
      default:
        //默认使用ipv4-ipv6切换输入框
        this.placeHolder = '0.0.0.0';
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.IPV4);
        if ( this._iconUrl && this._iconUrl.length === 2 ) {
          this._iconBackground = {
            IPV4: `url(${this._iconUrl[0]}) no-repeat`,
            IPV6: `url(${this._iconUrl[1]}) no-repeat`,
          };
        }
        break;
    }

    // 初始化邮箱后缀
    this.mailSuffix = [
      '@fhrd.com', '@fiberhome.com'
    ]

  }

  /**
   * 输入框校验
   * @memberof WafInputComponent
   */
  checkInputValue(): void {

    // input输入流
    let input$ =
      fromEvent(this.inputEle.nativeElement, 'input')
        .pipe(
          debounceTime(1000)
        )
        .subscribe((inputEvent: any) => {
          let inputVal = inputEvent.target.value;
          this.vertifiedResult = this.regExps.test(this._inputValue);
          console.log('regExps', this.regExps);
          console.log('vertifiedResult', this.vertifiedResult);
        });
  }

  getVertifiedResult(): boolean {
    return this.vertifiedResult;
  }

  /**
   * IPV4、IPV6切换,IPV4Mask、IPV6Mask切换
   * @memberof WafIpswitchComponent
   */
  private switchIp(): void {
    this.showIpv4 = !this.showIpv4;
    this.clearInput();
    switch (this.inputType) {
      case 'ipaddress':
        this.switchIpContent();
        break;
      case 'mask':
        this.switchMaskContent();
        break;
      default:
        this.switchIpContent();
        break;
    }
    setTimeout(() => {
      this.inputEle.nativeElement.focus();
    });
  }


  /**
   * IP输入框内容切换
   * @memberof WafInputComponent
   */
  switchIpContent(): void {

    //placeholder切换
    this.placeHolder = this.showIpv4 ? '0.0.0.0' : '';
    // 正则切换,当前为ipv4时
    if (this.showIpv4) {
      // 判断是否使用默认正则
      if (this._regExp) {
        // 判断传入的是否为数组
        if (this._regArray && this._regArray.length) {
          this.regExps = new RegExp(this._regArray[0]);
        } else {
          this.regExps = new RegExp(this._regExp);
        }
      } else {
        this.regExps = new RegExp(regExps.IPV4);
      }
    } else {
      // 判断是否使用默认正则
      if (this._regExp) {
        // 判断传入的是否为数组
        if (this._regArray && this._regArray.length) {
          this.regExps = new RegExp(this._regArray[1]);
        } else {
          this.regExps = new RegExp(this._regExp);
        }
      } else {
        this.regExps = new RegExp(regExps.IPV6);
      }
    }
  }


  /**
   * mask输入框内容切换
   * @memberof WafInputComponent
   */
  switchMaskContent(): void {

    //placeholder切换
    this.placeHolder = this.showIpv4 ? '255.255.255.0' : '';
    // 正则切换,当前为ipv4Mask时
    if (this.showIpv4) {
      // 判断是否使用默认正则
      if (this._regExp) {
        // 判断传入的是否为数组
        if (this._regArray && this._regArray.length) {
          this.regExps = new RegExp(this._regArray[0]);
        } else {
          this.regExps = new RegExp(this._regExp);
        }
      } else {
        this.regExps = new RegExp(regExps.maskIPV4);
      }
    } else {
      // 判断是否使用默认正则
      if (this._regExp) {
        // 判断传入的是否为数组
        if (this._regArray && this._regArray.length) {
          this.regExps = new RegExp(this._regArray[1]);
        } else {
          this.regExps = new RegExp(this._regExp);
        }
      } else {
        this.regExps = new RegExp(regExps.maskIPV6);
      }
    }
  }


  /**
   * 清除输入框内容
   * @memberof WafIpswitchComponent
   */
  private clearInput(): void {
    this._inputValue = '';
    // invalid
    this.vertifiedResult = false;
    this.onChange(this._inputValue);
  }

  /**
   * model=>view
   * 此方法用于父组件设置value到本组件中时angular自动调用
   * @param {*} value
   * @memberof WafInputComponent
   */
  writeValue(value: any) {
    if (value) {
      this._inputValue = value;
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
