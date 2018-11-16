import { Injectable } from "@angular/core";
import { ITpiGlobal, LoggerService, I18nService } from '@core';
import { constant } from '../global.constant';
import * as $ from "jquery";

/**
 * global服务
 * @export
 * @class GlobalService
 */
@Injectable()
export class GlobalService implements ITpiGlobal {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {I18nService} i18n
   * @memberof GlobalService
   */
  constructor(
      private logger: LoggerService,
      private i18n: I18nService
      ) {
    this.logger.debug(constant.identifier, 'Initialize global service.');
  }

  /**
   * 显示Loading框
   * @memberof GlobalService
   */
  showLoading(): void {
    console.log('show loading');
    $("#coverload").show();
  }

  /**
   * 隐藏Loading框
   * @memberof GlobalService
   */
  hideLoading(): void {
    $("#coverload").hide();
  }

  //TODO:
  /**
   * 弹出确认框
   * @param {string} msgKey
   * @param {() => void} accept
   * @param {() => void} [reject]
   * @memberof GlobalService
   */
  confirmDialog(/*msgKey: string, accept: () => void, reject?: () => void*/): void {

    // this.hideLoading();

    // this.i18n.get('confirm.info').subscribe((resultTitle) => {

    //   this.i18n.get(msgKey).subscribe((result) => {

    //     this.modalService.confirm({
    //       nzTitle: '<b>' + resultTitle + '</b>',
    //       nzContent: result,
    //       nzOnOk: accept,
    //       nzOnCancel: reject
    //     });
    //   });
    // });
  }

  /**
   * 弹出警告框
   * @param {string} msgKey
   * @memberof GlobalService
   */
  warnDialog(/*msgKey: string*/): void {

    // this.hideLoading();

    // this.i18n.get('warn.info').subscribe((resultTitle) => {

    //   this.i18n.get(msgKey).subscribe((result) => {

    //     this.modalService.warning({
    //       nzTitle: '<b>' + resultTitle + '</b>',
    //       nzContent: result
    //     });
    //   });
    // });
  }

  /**
   * 弹出错误框
   * @param {string} msgKey
   * @memberof GlobalService
   */
  errorDialog(/*msgKey: string*/): void {

    // this.hideLoading();

    // this.i18n.get('error.info').subscribe((resultTitle) => {

    //   this.i18n.get(msgKey).subscribe((result) => {

    //     this.modalService.error({
    //       nzTitle: '<b>' + resultTitle + '</b>',
    //       nzContent: result
    //     });
    //   });
    // });
  }

  /**
   * 弹出成功框
   * @param {string} msgKey
   * @param {() => void} [callback]
   * @param {boolean} [auto]
   * @param {number} [delay]
   * @memberof GlobalService
   */
  successDialog(/*msgKey: string, callback?: () => void, auto?: boolean, delay?: number*/): void {

    // this.hideLoading();

    // this.i18n.get('succ.info').subscribe((resultTitle) => {

    //   this.i18n.get(msgKey).subscribe((result) => {

    //     this.modalService.success({
    //       nzTitle: '<b>' + resultTitle + '</b>',
    //       nzContent: result
    //     });
    //   });
    // });
  }
}
