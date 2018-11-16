import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lts-model',
  templateUrl: './lts-model.component.html',
  styleUrls: ['./lts-model.component.scss']
})
export class LtsModelComponent implements OnInit {

  /** 自定义model变量 */
  private _ltsModel;

  @Output()
  ltsModelChange: EventEmitter<any> = new EventEmitter();

  /** 返回父组件变化后的值 */
  @Input()
  get ltsModel() {
    return this._ltsModel;
  }

  set ltsModel(value) {
    this._ltsModel = value;
    this.ltsModelChange.emit(value);
  } 

  constructor() { }

  ngOnInit() {
    // setTimeout(()=>{
    //   this._ltsModel = 'lts-model';
    // },10000);
    // setInterval(()=>{
    //   console.log('from lts-model---',this._ltsModel);
    // },1000);
  }

}
