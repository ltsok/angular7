
/**
 * 菜单接口模型：菜单项
 * @export
 * @class TpiMenuItem
 */
export class TpiMenuItem {

  /** 菜单项id：菜单唯一标识 */
  id: number;

  /** 菜单类型 */
  type: TpiMenuItemType = new TpiMenuItemType();

  /** 菜单项名称 */
  name: string;

  /** 菜单项路由路径 */
  path: string;

  /** 菜单项路由参数 */
  pathParam: any;

  /** 链接菜单项id */
  linkId: number;

  /** 目标component */
  component: any;

  /** 目标component参数 */
  compParam: any;

  /** 监控组：当菜单项为监控类型的时候有效 */
  svGroupNo: number;

  /** 菜单项图标 */
  icon: string;

  /** 菜单项图标(叠加在菜单项图标之上) */
  secondaryIcon: string;

  /** 父级菜单名称 */
  parentId: number;

  /** 是否隐藏 */
  isHide: boolean = false;

  /** 是否显示面包屑 */
  isShowBreadcrumb: boolean = true;

  /** 菜单项参数 */
  param: any;
}

/**
 * 菜单类型
 * @export
 * @class TpiMenuItemType
 */
export class TpiMenuItemType {

  /** 是否是特殊单项 */
  isSpecial: boolean = false;

  /** 是否是根菜单项 */
  isRoot: boolean = false;

  /** 是否是快捷菜单项 */
  isShortcut: boolean = false;

  /** 是否是监控菜单项 */
  isSupervisory: boolean = false;

  /** 是否是常驻页 */
  isResidentPage: boolean = false;
}

export class SubMenuItems {

  /** 菜单名称 */
  name: string;

  /** 菜单路径 */
  path: string;

  /** 菜单图标 */
  icon: string;

  /** 激活状态 */
  isActive: boolean;
}
