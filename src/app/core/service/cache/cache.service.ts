import { constant } from './cache.constant';
import { Injectable } from "@angular/core";
import { LoggerService } from '../logger/logger.service';

/**
 * cache服务
 * @export
 * @class CacheService
 */
@Injectable()
export class CacheService {

    /** 缓存 */
    private cache: Map<string, any> = new Map<string, any>();


    /**
     * 构造函数
     * @param {LoggerService} logger
     * @memberof CacheService
     */
    constructor(private logger: LoggerService) {
        this.logger.info(constant.indentifier, 'Inititalize cache service.');
    }


    /**
     * 获取缓存值
     * @param {string} key
     * @memberof CacheService
     */
    getCache(key: string): string {
        let value = this.cache.get(key);
        this.logger.debug(constant.indentifier, value, `get-cache-${key}`);
        return value;
    }


    /**
     * 设置缓存值
     * @param {string} key
     * @param {*} value
     * @memberof CacheService
     */
    setCache(key: string, value: any): void {
        this.cache.set(key, value);
        this.logger.debug(constant.indentifier, value, `set-cache-${key}`);
    }

    getAllCache(): Map<string, any> {
        this.logger.debug(constant.indentifier, this.cache, 'get-all-cache');
        return this.cache;
    }
}