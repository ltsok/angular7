import { TpiMenuItem, SubMenuItems } from './tpi-menu.model'

/**
 * 菜单接口
 * @export
 * @class TpiMenu
 */
export interface ITpiMenu {

  /**
   * 获取菜单项
   * @returns {TpiMenuItem[]}
   * @memberof ITpiMenu
   */
  getMenuItems(): TpiMenuItem[];


  /**
   * 获取侧边栏菜单
   * @returns {SubMenuItems[]}
   * @memberof ITpiMenu
   */
  getSubMenuItems(): SubMenuItems[];
}