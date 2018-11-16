import { Injectable, Inject } from "@angular/core";
import { constant } from './tpi.constant';
import { ITpiGlobal } from './tpi-global/tpi-global.interface';
import { LoggerService } from '../logger/logger.service';

/**
 * 模板编程接口服务(全局)
 * @export
 * @class TpiGlobalService
 */
@Injectable()
export class TpiGlobalService {


    /**
     * 构造函数
     * @param {LoggerService} logger
     * @param {ITpiGlobal} globalService
     * @memberof TpiGlobalService
     */
    constructor(
        private logger: LoggerService,
        @Inject('tpi.global') private globalService: ITpiGlobal
    ) {
        this.logger.info(constant.identifier, 'Initialize tpi-global service.');
    }

    getGlobalService(): ITpiGlobal {
        return this.globalService;
    }
}