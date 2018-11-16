import { Pipe, PipeTransform } from '@angular/core';
import { constant } from './i18n.constant';
import { LoggerService } from '../logger/logger.service';
import { I18nService } from './i18n.service';
/*
 * 图片国际化管道：根据当前语言类型转换图片路径
 * Usage:
 *   './assets/111/a.png' | i18n
 * Example:
 *   {{'./assets/111/a.png' | i18n}}
 *   若当前语言类型为zh，则转换结果为：./assets/111/a.png
 *   若当前语言类型为en，则转换结果为：./assets/111/en/a.png
*/
@Pipe({ name: 'i18n' })
export class I18nPipe implements PipeTransform {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {I18nService} i18n
   * @memberof I18nPipe
   */
  constructor(private logger: LoggerService, private i18n: I18nService) {
    this.logger.info(constant.identifier, "Initialize i18n pipe.");
  }

  /**
   * 管道调用
   * @param {string} pngUrl
   * @returns {string}
   * @memberof I18nPipe
   */
  transform(pngUrl: string): string {

    // 若当前语言类型为中文，则图片路径不变
    if (this.i18n.getCurrentLang() === "zh") {
      this.logger.debug(constant.identifier, pngUrl, 'transform-zh');
      return pngUrl;
    }

    // 若当前语言类型为英文，则路径中需添加en子目录
    let newPngUrl = "";
    let urlArray = pngUrl.split("/");
    for (let i = 0; i < urlArray.length; i++) {
      if (i != urlArray.length - 1) {
        newPngUrl += urlArray[i] + "/";
      } else {
        newPngUrl += "en/" + urlArray[i];
      }
    }
    this.logger.debug(constant.identifier, newPngUrl, 'transform-en');
    return newPngUrl;
  }
}
