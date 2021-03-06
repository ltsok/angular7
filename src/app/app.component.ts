import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import * as $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /** 主题 */
  darkTheme = false;

  /** 导航栏 */
  routerList = [
    {name: '首页', path: '/home'},
    {name: '历届成绩', path: '/achievements'},
    {name: '关于我们', path: '/introduction'},
    {name: '最新资讯', path: '/information'},
    {name: '画室公开课', path: '/demonstration'},
    {name: '预约报名', path: '/contact'},
  ];
  /** 手机端页脚 */
  shortList = [
    {name: '首页', path: '/home'},
    {name: '成绩', path: '/achievements'},
    {name: '我们', path: '/introduction'},
    {name: '资讯', path: '/information'},
    {name: '公开课', path: '/demonstration'},
    {name: '报名', path: '/contact'}
  ];

  /** 是否隐藏下拉导航栏 */
  hideMenu: boolean = false;

  /**
   * 构造函数
   * @param {OverlayContainer} oc
   * @memberof AppComponent
   */
  constructor(
    private oc: OverlayContainer
  ){
    $(window).resize(()=>{
      if ( window.innerWidth > 768 ) {
        this.hideMenu = false;
      }
    });
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

  /**
   * 切换下拉菜单
   * @memberof AppComponent
   */
  toggleHide() {
    this.hideMenu = !this.hideMenu;
  }

}
