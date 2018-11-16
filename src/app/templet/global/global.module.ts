import { NgModule } from "@angular/core";
import { SharedModule } from '@shared';
import { GlobalComponent } from './global.component';
import { GlobalService } from './service/global.service';
import { LoggerService } from '@core';
import { constant } from './global.constant';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        GlobalComponent
    ],
    providers: [
        { provide: 'tpi.global', useClass: GlobalService }
    ],
    exports: [
        GlobalComponent
    ]
})

export class GlobalModule {
    
    /**
     * 构造函数
     * @param {LoggerService} logger
     * @memberof GlobalModule
     */
    constructor(private logger: LoggerService) {
        this.logger.info(constant.identifier, 'Initialize global module.');
    }
}