import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, forwardRef, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/** 默认正则 */
const regExps = {
  IPV4: `^([0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])(\\.(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)){3}$`,
  IPV6: "^([\\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}"
  + "(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^::([\\da-fA-F]{1,4}:){0,4}"
  + "((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}"
  + "(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:):([\\da-fA-F]{1,4}:){0,3}"
  + "((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}"
  + "(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){2}:([\\da-fA-F]{1,4}:){0,2}"
  + "((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}"
  + "(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){3}:([\\da-fA-F]{1,4}:){0,1}"
  + "((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}"
  + "(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}"
  + "(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){7}"
  + "[\\da-fA-F]{1,4}$|^:((:[\\da-fA-F]{1,4}){1,6}|:)$|^[\\da-fA-F]{1,4}:((:[\\da-fA-F]{1,4}){1,5}|:)"
  + "$|^([\\da-fA-F]{1,4}:){2}((:[\\da-fA-F]{1,4}){1,4}|:)$|^([\\da-fA-F]{1,4}:){3}((:[\\da-fA-F]{1,4})"
  + "{1,3}|:)$|^([\\da-fA-F]{1,4}:){4}((:[\\da-fA-F]{1,4}){1,2}|:)"
  + "$|^([\\da-fA-F]{1,4}:){5}:([\\da-fA-F]{1,4})?$|^([\\da-fA-F]{1,4}:){6}:$ ",
  maskIPV4: "((255|254|252|248|240|224|192|128)(\\.0){3})"
  + "|((255\\.){1}(255|254|252|248|240|224|192|128|0)(\\.0){2})"
  + "|((255\\.){2}(255|254|252|248|240|224|192|128|0)(\\.0){1})"
  + "|((255\\.){3}(255|254|252|248|240|224|192|128|0))",
  // TODO
  maskIPV6: ``,
  phone: `^1[34578]\\d{9}$`,
  mail: `^[A-Za-z\\d]+([-_.][A-Za-z\\d]+)*$`
};

/** 邮箱后缀 */
const mailSuffixs = [
  '@fhrd.com', '@fiberhome.com'
]

/** 默认placeholder */
const placeHolders = {
  IPV4: '0.0.0.0',
  IPV6: '',
  maskIPV4: '255.255.255.0',
  maskIPV6: '',
  phone: '',
  mail: ''
}

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

  /** 自定义_placeHolder */
  @Input()
  set placeholder(holder: string | string[]) {
    if (typeof (holder) === 'string') {
      this._placeHolder = holder;
    }
    if (Array.isArray(holder) && holder.length ) {
      //默认使用第一项
      this._placeHolder = holder[0];
      this._placeHolderArr = holder;
    }
  }

  /** 自定义icon */
  @Input()
  set iconClass(_class: string | string[]) {
    this._iconClass = _class;
  }

  /** 自定义正则 */
  @Input()
  set regExp(reg: string | string[]) {
    if (typeof (reg) === 'string') {
      this._regExp = new RegExp(reg);
    }
    if (Array.isArray(reg) && reg.length) {
      // 默认使用第一项作为验证
      this._regExp = new RegExp(reg[0]);
      this._regArray = reg;
    }
  }

  /** 自定义邮箱后缀 */
  @Input()
  set mailSuffix(mailsuf: string[]) {
    if ( mailsuf && mailsuf.length ) {
      this._mailSuffix = mailsuf;
    } else {
      this._mailSuffix = mailSuffixs;
    }
  }

  /** 输出校验结果 */
  @Output()
  checkResult: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** 自定义图标 */
  _iconClass: any;

  /** 图标类名 */
  iconClassName: any;

  /** placeHolder */
  private placeHolders: string;

  /** 输入placeHolder */
  private _placeHolder: string;

  /** 输入placeholder数组 */
  private _placeHolderArr: string[];

  /** 正则 */
  private regExps: RegExp;

  /** 输入正则 */
  private _regExp: RegExp;

  /** 输入正则数组 */
  private _regArray: string[];

  /** 校验结果 */
  private vertifiedResult: boolean = false;

  /** 提示信息 */
  private toolTip: string = '';

  /** 是否显示tooltip */
  private showTooltip: boolean;

  /** input输入值 */
  private _inputValue: string;

  /** 输入默认为IPV4 */
  private showIpv4: boolean = true;

  /** 邮箱后缀 */
  private _mailSuffix: string[];

  /** 定义空函数,在view => model变化时被赋值 */
  private onChange: (value: string | string[]) => void = () => null;

  private onTouched: () => void = () => null;

  /** 获取input元素 */
  @ViewChild('wafInput')
  inputEle: ElementRef;

  /** 输入、输出双向绑定 */
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


  /**
   * 初始化输入框内容
   * @memberof WafInputComponent
   */
  initData(): void {

    // 初始化_placeHolder、_regExp、图标类名
    switch (this.inputType) {
      case 'ipaddress':
        this.placeHolders = this._placeHolder ? this._placeHolder : placeHolders.IPV4;
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.IPV4);
        if ( this._iconClass && this._iconClass.length === 2 ) {
          this.iconClassName = [];
          this._iconClass.map((v)=>{
            let obj = {};
            obj['ip-icon'] = true;
            obj['fhfont'] = true;
            obj[v] = true;
            this.iconClassName.push(obj);
          });
        }
        break;
      case 'mask':
        this.placeHolders = this._placeHolder ? this._placeHolder : placeHolders.maskIPV4;
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.maskIPV4);
        if ( this._iconClass && this._iconClass.length === 2 ) {
          this.iconClassName = [];
          this._iconClass.map((v) => {
            const obj: any = {};
            obj['ip-icon'] = true;
            obj['fhfont'] = true;
            obj[v] = true;
            this.iconClassName.push(obj);
          });
        }
        break;
      case 'phone':
        this.placeHolders = this._placeHolder ? this._placeHolder : placeHolders.phone;
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.phone);
        if ( this._iconClass && typeof this._iconClass === 'string' ) {
          this.iconClassName = this._iconClass;
        }
        if (Array.isArray(this._iconClass) && this._iconClass.length) {
          this.iconClassName = this._iconClass[0];
        }
        break;
      case 'mail':
        this.placeHolders = this._placeHolder ? this._placeHolder : placeHolders.mail;
        this.regExps = this._regExp ? this._regExp : new RegExp(regExps.mail);
        if ( this._iconClass && typeof this._iconClass === 'string' ) {
          this.iconClassName = this._iconClass;
        }
        if (Array.isArray(this._iconClass) && this._iconClass.length) {
          this.iconClassName = this._iconClass[0];
        }
        break;
      default:
        //默认使用普通输入框
        this.placeHolders = this._placeHolder ? this._placeHolder : '';
        this.regExps = this._regExp ? this._regExp : new RegExp('');
        if ( this._iconClass && typeof this._iconClass === 'string' ) {
          this.iconClassName = this._iconClass;
        }
        if (Array.isArray(this._iconClass) && this._iconClass.length) {
          this.iconClassName = this._iconClass[0];
        }
        break;
    }

    // 初始化邮箱后缀
    this.mailSuffix = mailSuffixs;
  }

  /**
   * 输入框校验
   * @memberof WafInputComponent
   */
  checkInputValue(): void {
    let inputRightnow$ =
      fromEvent(this.inputEle.nativeElement, 'input')
      .subscribe((event: any) =>{
        this.checkResult.emit(this.regExps.test(this._inputValue));
      });
    // 显示层优化
    // input输入流
    let inputDelay$ =
      fromEvent(this.inputEle.nativeElement, 'input')
        .pipe(
          debounceTime(1000)
        )
        .subscribe((inputEvent: any) => {
          this.vertifiedResult = this.regExps.test(this._inputValue);
          if ( this.vertifiedResult ) {
            setTimeout(()=>{
              this.toolTip = '';
              this.showTooltip = false;
            });
          } else {
            this.toolTip = '格式不正确';
            this.showTooltip = true;
          }
        });
  }


  /**
   * 获取校验结果
   * @returns {boolean}
   * @memberof WafInputComponent
   */
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

    // placeholer、正则切换,当前为ipv4时
    if (this.showIpv4) {

      // 判断是否使用默认placeholder
      if (this._placeHolder) {
        // 判断传入的是否为数组
        if (this._placeHolderArr && this._placeHolderArr.length) {
          this.placeHolders = this._placeHolderArr[0];
        }
      } else {
        this.placeHolders = placeHolders.IPV4;
      }

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

      // 判断是否使用默认placeholder
      if (this._placeHolder) {
        // 判断传入的是否为数组
        if (this._placeHolderArr && this._placeHolderArr.length) {
          this.placeHolders = this._placeHolderArr[1];
        }
      } else {
        this.placeHolders = placeHolders.IPV6;
      }

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

    // placeholer、正则切换,当前为ipv4mask时
    if (this.showIpv4) {

      // 判断是否使用默认placeholder
      if (this._placeHolder) {
        // 判断传入的是否为数组
        if (this._placeHolderArr && this._placeHolderArr.length) {
          this.placeHolders = this._placeHolderArr[0];
        }
      } else {
        this.placeHolders = placeHolders.maskIPV4;
      }

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

      // 判断是否使用默认placeholder
      if (this._placeHolder) {
        // 判断传入的是否为数组
        if (this._placeHolderArr && this._placeHolderArr.length) {
          this.placeHolders = this._placeHolderArr[0];
        }
      } else {
        this.placeHolders = placeHolders.maskIPV6;
      }

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
