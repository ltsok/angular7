import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NzIconService } from 'ng-zorro-antd';

/** 采用mat-icon时使用 */
export const loadSvgResources = (ir: MatIconRegistry, ds: DomSanitizer):void => {
    const imgDir = `assets/img`;
    const avatarDir = `${imgDir}/avatar`;
    const sidebarDir = `${imgDir}/sidebar`;
    // iconfont项目图标
    ir.registerFontClassAlias('ltsfont','lts');
    // svg图标集合
    ir.addSvgIconSetInNamespace('avatars', ds.bypassSecurityTrustResourceUrl(`${avatarDir}/avatars.svg`));
}

/** 采用iconfont时使用 */
export const loadIconFontResource = (_iconService: NzIconService): void => {
    _iconService.fetchFromIconfont({
        scriptUrl: 'assets/fonts/fonts-lts/iconfont.js'
    });
}