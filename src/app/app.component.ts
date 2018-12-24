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
    {name: 'xxxx', path: '/home'},
    {name: 'xxxx', path: '/introduction'},
    {name: 'xxxx', path: '/information'},
    {name: 'xxxx', path: '/achievements'},
    {name: 'xxxx', path: '/demonstration'},
    {name: 'xxxx', path: '/contact'}
  ];
  routerList2 = [
    {name: '官网首页', path: '/home'},
    {name: '画室简介', path: '/introduction'},
    {name: '最新资讯', path: '/information'},
    {name: '历届成绩', path: '/achievements'},
    {name: '画室公开课', path: '/demonstration'},
    {name: '联系我们', path: '/contact'}
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
