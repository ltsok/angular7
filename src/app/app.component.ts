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

  /** 导航栏 */
  routerList = [
    {name: '官网首页', path: '/home'},
    {name: '画室简介', path: '/introduction'},
    {name: '最新资讯', path: '/information'},
    {name: '历届成绩', path: '/achievements'},
    {name: '画室公开课', path: '/demonstration'},
    {name: '联系我们', path: '/contact'}
  ];

  /** 是否隐藏下拉导航栏 */
  hideMenu: boolean = true;

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

  /**
   * 切换下拉菜单
   * @memberof AppComponent
   */
  toggleHide() {
    this.hideMenu = !this.hideMenu;
  }

}
