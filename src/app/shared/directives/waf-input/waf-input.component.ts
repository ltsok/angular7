import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const regExps = {
  IPV4: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
  IPV6: '^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$'
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


export class WafInputComponent implements OnInit, ControlValueAccessor{

  /** 输入框类型 */
  @Input()
  type: string;

  /** 输入正则 */
  private _regExp: RegExp;

  @Input()
  set regExp(reg: RegExp){
    if (reg) {
      this._regExp = new RegExp(reg);
    }
  }

  /** 是否显示图标 */
  private showIcon: boolean = false;

  /** input输入值 */
  private _inputValue: string;

  /** 定义空函数,在view => model变化时被赋值 */
  private onChange: (value: string | string[]) => void = () => null;

  private onTouched: () => void = () => null;

  set inputValue(v: any) {
    if (v !== this._inputValue) {
      this._inputValue = v;
      this.onChange(this._inputValue);
    }
  }

  get inputValue() {
    return this._inputValue;
  }

  /** 输入默认为IPV4 */
  private showIpv4:boolean = true;

  /** 输入框placeholder */
  private placeHolder: string;

  ngOnInit(): void {

    // 初始化默认placeholder和_regExp
    switch(this.type) {
      case 'ipaddress':
        this.placeHolder = '0.0.0.0';
        this._regExp = new RegExp(regExps.IPV4);
      break;
      case 'mask':
        this.placeHolder = '255.255.255.0';
      break;
      default:
        this.placeHolder = '';
    }
  }

  /**
   * IPV4、IPV6切换
   * @memberof WafIpswitchComponent
   */
  private switchIp(): void {
    this.showIpv4 = !this.showIpv4;
    this.clearInput();
    setTimeout(()=>{
      document.getElementById("waf-input").focus();
      switch(this.type) {
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

  _keyup(): void {
    let result = this._regExp.test(this._inputValue);
    console.log(this._inputValue, result);
  }

}
