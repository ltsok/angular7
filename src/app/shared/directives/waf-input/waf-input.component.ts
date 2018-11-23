import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, Output, EventEmitter, forwardRef, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { fromEvent, interval } from 'rxjs';
import { switchMap, take, debounceTime } from 'rxjs/operators';

const regExps = {
  IPV4: `^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$`,
  IPV6: `^(([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}{1}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}{1}|((22[0-3]丨2[0-1][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(:[0-9A-Fa-f]{1,4}{1,2}|:((22[0-3]丨2[0-1][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}{1,3}|:((22[0-3]丨2[0-1][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})){3})|:))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}{1,4}|:((22[0-3]丨2[0-1][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})){3})|:))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}{1,5}|:((22[0-3]丨2[0-1][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})){3})|:))|(([0-9A-Fa-f]{1,4}:){1}(:[0-9A-Fa-f]{1,4}{1,6}|:((22[0-3]丨2[0-1][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})){3})|:))|(:(:[0-9A-Fa-f]{1,4}{1,7}|:((22[0-3]丨2[0-1][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|0[1 -9][0-9]|([0-9])]{1,2})){3})|:))$`,
  mask: ``,
  phone: ``,
  mail: ``
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


export class WafInputComponent implements OnInit, AfterViewInit, ControlValueAccessor{

  /** 输入框类型 */
  @Input('type')
  inputType: string;

  @Input()
  set regExp(reg: RegExp){
    if (reg) {
      this._regExp = new RegExp(reg);
    }
  }
  
  /** 输入正则 */
  private _regExp: RegExp;

  /** 校验结果 */
  private vertifiedResult: boolean = false;

  /** 提示信息 */
  private toolTip: string;

  /** 是否显示tooltip */
  private showTooltip: boolean;

  /** 是否显示前置内容 */
  private showPrefixTemp: boolean;

  /** 是否显示后置内容 */
  private showSuffixTemp: boolean;

  /** input输入值 */
  private _inputValue: string;

  /** 输入默认为IPV4 */
  private showIpv4:boolean = true;

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

    // 初始化默认placeholder和_regExp
    switch(this.inputType) {
      case 'ipaddress':
        this.placeHolder = '0.0.0.0';
        this._regExp = new RegExp(regExps.IPV4);
      break;
      case 'mask':
        this.placeHolder = '255.255.255.0';
        this._regExp = new RegExp(regExps.mask);
      break;
      case 'phone':
        this.placeHolder = '';
        this._regExp = new RegExp(regExps.phone);
      break;
      case 'mail':
        this.placeHolder = '';
        this._regExp = new RegExp(regExps.mail);
        console.log(this.placeHolder);
      break;
      default:
        this.placeHolder = '';
    }

    // 初始化邮箱后缀
    this.mailSuffix = [
      '@fhrd.com','@fiberhome.com'
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
    .subscribe((inputEvent:any)=>{
      let inputVal = inputEvent.target.value;
      switch (this.inputType) {
        case 'ipaddress':
          this._regExp =this.showIpv4 ? new RegExp(regExps.IPV4) : new RegExp(regExps.IPV6);
        break;
        case 'mask':
          this._regExp =this.showIpv4 ? new RegExp(regExps.IPV4) : new RegExp(regExps.IPV6);
        break;
      }
      this.vertifiedResult = this._regExp.test(this._inputValue);
    });
  }

  getVertifiedResult(): boolean {
    return this.vertifiedResult;
  }

  /**
   * IPV4、IPV6切换
   * @memberof WafIpswitchComponent
   */
  private switchIp(): void {
    this.showIpv4 = !this.showIpv4;
    this.clearInput();
    setTimeout(()=>{
      this.inputEle.nativeElement.focus();
      switch(this.inputType) {
        case 'ipaddress':
          this.placeHolder = this.placeHolder ? '': '0.0.0.0';
        break;
        case 'mask':
          this.placeHolder = this.placeHolder ? '': '255.255.255.0';
        break;
        default:
          this.placeHolder = '';
      }
    });
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
