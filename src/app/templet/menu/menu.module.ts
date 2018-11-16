import { SharedModule } from '@shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { constant } from './menu.constant';
import { MenuService } from './service/menu.service';
import { LoggerService } from './../../core/service/logger/logger.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ],
  providers: [
    MenuService
  ]
})
export class MenuModule {
  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof GlobalModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize submenu module.');
  }
}
