import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { LoggerService } from '../logger/logger.service';
// import { EventService } from '@waf_service/event';
import { constant } from './i18n.constant';

/**
 * i18n服务类
 * @export
 * @class I18nService
 */
@Injectable()
export class I18nService {

  /** 空Observable */
  observable = Observable.create((observer) => {
    observer.next("");
    observer.complete();
  });

  /**
   * 构造函数
   * @param {TranslateService} translateService
   * @param {LoggerService} logger
   * @param {EventService} event
   * @memberof I18nService
   */
  constructor(private translateService: TranslateService, private logger: LoggerService,
    /*private event: EventService*/) {

    // 当前只做中英文的国际化
    this.translateService.addLangs(["zh", "en"]);

    // 根据浏览器的语言类型设置当前应用的语言类型
    if (this.translateService.getBrowserCultureLang().indexOf("zh") != -1) {
      this.translateService.use("zh");
    } else {
      this.translateService.use("en");
    }

    // 打印日志
    this.logger.info(constant.identifier, "Initialize i18n service.");
  }

  /**
   * 获取当前使用的语言类型
   * @returns {string}
   * @memberof I18nService
   */
  getCurrentLang(): string {
    let curLang = this.translateService.currentLang;
    this.logger.debug(constant.identifier, curLang, 'current-lang');
    return curLang;
  }

  /**
   * 获取当前支持的语言类型数组
   * @returns {Array<string>}
   * @memberof I18nService
   */
  getLangs(): Array<string> {
    let langs = this.translateService.getLangs();
    this.logger.debug(constant.identifier, langs, "langs");
    return langs;
  }

  /**
   * 根据key值获取国际化后的字符串
   * @param {string} key
   * @returns {Observable<string>}
   * @memberof I18nService
   */
  get(key: string): Observable<string> {
    this.logger.debug(constant.identifier, key, "get");
    if (key) {
      return this.translateService.get(key);
    } else {
      return this.observable;
    }
  }

  /**
   * 修改当前使用的语言类型
   * @param {string} lang
   * @memberof I18nService
   */
  changeLang(lang: string): Promise<any> {
    this.logger.debug(constant.identifier, lang, "change-lang");
    return this.translateService.use(lang).toPromise().then(() => {
    //   this.event.publish('event.service.i18n.change.lang', { lang: lang });
    });
  }
}
