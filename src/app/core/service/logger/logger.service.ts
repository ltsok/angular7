import { constant } from './logger.constant';
import { Injectable } from '@angular/core';
import * as log from 'loglevel';
import * as prefix from 'loglevel-plugin-prefix';


/**
 * 日志服务
 * @export
 * @class LoggerService
 */
@Injectable()
export class LoggerService {
    

    /**
     * 构造函数：初始化日志格式和日志级别
     * @memberof LoggerService
     */
    constructor() {

        // 日志格式
        prefix.apply(log, {
            template: '[%t] [%l]',
            timestampFormatter: (date) => { return date.toISOString() },
            levelFormatter: (level) => { return level.charAt(0).toUpperCase() + level.substr(1) }
        });

        // 初始化日志级别
        log.setLevel(log.levels.INFO);

        // 打印日志
        log.info(constant.identifier, 'Initialize logger service');
    }


    /**
     * 获取当前日志级别：只管info和debug两个级别
     * @returns {string}
     * @memberof LoggerService
     */
    getLevel(): string {
        switch (log.getLevel()) {
            case 1: return 'debug';
            case 2: return 'info';
            default: return 'unknown';
        }
    }


    /**
     * 打开debug日志
     * @memberof LoggerService
     */
    openDebug(): void {
        log.setLevel(log.levels.DEBUG);
    }


    /**
     * 关闭debug日志
     * @memberof LoggerService
     */
    closeDebug(): void {
        log.setLevel(log.levels.INFO);
    }


    /**
     * 打印debug日志
     * @param {string} module
     * @param {*} msg
     * @param {string} [desc]
     * @memberof LoggerService
     */
    debug(module: string, msg: any, desc?: string): void {
        log.debug(this.getKeyWord(module, desc));
        log.debug(msg);
    }


    /**
     * 打印info日志
     * @param {string} module
     * @param {string} msg
     * @memberof LoggerService
     */
    info(module: string, msg: string): void {
        log.info(this.getKeyWord(module) + msg);
    }


    /**
     * 打印error日志
     * @param {string} module
     * @param {*} msg
     * @param {string} [desc]
     * @memberof LoggerService
     */
    error(module: string, msg: any, desc?: string): void {
        log.error(this.getKeyWord(module));
        log.error(msg);
    }

    /**
     * 获取日志记录的关键字
     * @private
     * @param {string} module
     * @param {string} desc
     * @returns
     * @memberof LoggerService
     */
    private getKeyWord(module: string, desc?: string) {
        return desc ? `[${module}-<${desc}>] : ` : `[${module}] : `;
    }
}