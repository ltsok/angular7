import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /** 主题 */
  darkTheme = false;

  /**
   * 构造函数
   * @param {OverlayContainer} oc
   * @memberof AppComponent
   */
  constructor(
    private oc: OverlayContainer
  ){
  }

  /**
   * 切换主题
   * @param {*} dark
   * @memberof AppComponent
   */
  switchTheme(dark) {
    this.darkTheme = dark;
    this.oc.getContainerElement().className = dark ? 'myapp-dark-theme' : null;
  }

}
