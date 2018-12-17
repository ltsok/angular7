import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class WafMenuService {

    /** 一级菜单选中广播 */
    public $selectSubject: Subject<any> = new Subject();

    /** 三级菜单选中广播 */
    public $selectGroupSubject: Subject<any> = new Subject();

    /**
     * 获取uuid
     * @private
     * @returns {string}
     * @memberof TutorialEditorComponent
     */
    public getuuid(): string {
        let s = [];
        let hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';

        let uuid = s.join('');
        return uuid;
    }
}