import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from './service/menu.service';
import { Router } from '@angular/router';
import { SubMenuItems } from './../../core/service/tpi/tpi-menu/tpi-menu.model';

/**
 * 模块菜单组件
 * @export
 * @class MenuComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'lts-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input()
  menuItems: any[];

  constructor(
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuItems = this.menuService.getSubMenuItems();
  }

  navigate(index: number): void {
    this.router.navigate([this.menuItems[index].path]);
    this.menuItems.forEach((item, i , arr)=>{
      arr[i].isActive = false;
    });
    this.menuItems[index].isActive = true;
  }

  // onFocus(index: number): void {
  //   if ( this.menuItems[index] ) return ;
  //   this.menuItems[index].isActive = true;
  // }

  // outFocus(index: number): void {
  //   if (  )
  // }

}
