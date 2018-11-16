import { Injectable } from "@angular/core";
import { CacheService } from '../cache/cache.service';
import { LoggerService } from '../logger/logger.service';
import { constant } from './storage.constant';


/**
 * localstorage服务
 * @export
 * @class StorageService
 */
@Injectable()
export class StorageService {

    /** localstorage实例 */
    localstorage = window.localStorage;

    /**
     * 构造函数
     * @param {LoggerService} logger
     * @param {CacheService} cache
     * @memberof StorageService
     */
    constructor(private logger: LoggerService, private cache: CacheService) {
        this.logger.info(constant.identifier, 'Initialize localstorage service.');
    }


    /**
     * 获取localstorage的值
     * @param {string} key
     * @param {boolean} [isSystem]
     * @returns {string}
     * @memberof StorageService
     */
    getValue(key: string, isSystem?: boolean): string {
        let realkey = this.getRealKey(key, isSystem);
        let value = this.localstorage.getItem(realkey);
        this.logger.debug(constant.identifier, value, `get-${realkey}`);
        return value;
    }

    
    /**
     * 获取该localstorage的json对象
     * @param {string} key
     * @param {boolean} [isSystem]
     * @returns {*}
     * @memberof StorageService
     */
    getJsonObj(key: string, isSystem?: boolean): any {
        return JSON.parse(this.getValue(key, isSystem));
    }


    /**
     * 设置localStorage的值
     * @param {string} key
     * @param {*} value
     * @param {boolean} [isSystem]
     * @memberof StorageService
     */
    setValue(key: string, value: any, isSystem?: boolean): void {
        let realKey = this.getRealKey(key, isSystem);
        if ( typeof value === 'string' ) {
            this.localstorage.setItem(realKey, value);
        } else {
            let jsonValue = JSON.stringify(value);
            this.localstorage.setItem(realKey, jsonValue);
            this.logger.debug(constant.identifier, jsonValue, `set-${realKey}`);
        }
    }


    /**
     * 删除localStorage的值
     * @param {string} key
     * @param {boolean} [isSystem]
     * @memberof StorageService
     */
    remove(key: string, isSystem?: boolean) {
        let realkey = this.getRealKey(key, isSystem);
        this.localstorage.removeItem(realkey);
        this.logger.debug(constant.identifier, realkey, 'remove');
    }


    /**
     * 清空用户级的localstorage
     * @memberof StorageService
     */
    clearCur(): void {
        let delkeys = [];
        let token = this.cache.getCache('token');
        let length = this.localstorage.length;
        for ( let i = 0; i < length; i ++ ) {
            let realKey = this.localstorage.key(i);
            if ( realKey && realKey.indexOf(constant.userLocalstorageIdentifier) !== -1 ) {
                delkeys.push(realKey);
            }
        };
        delkeys.forEach(key => this.localstorage.removeItem(key));
        this.logger.debug(constant.identifier, constant.userLocalstorageIdentifier, 'clear-user');
    }

    /**
     * 获取真实的key值（如果是用户级信息则要加上token）
     * @private
     * @param {string} key
     * @param {boolean} [isSystem]
     * @returns {string}
     * @memberof StorageService
     */
    private getRealKey(key: string, isSystem?: boolean): string {
        return isSystem ? key : this.cache.getCache('token') + constant.userLocalstorageIdentifier + key;
    }
}