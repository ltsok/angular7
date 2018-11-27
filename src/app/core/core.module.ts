import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { constant } from './service/i18n/i18n.constant';
import { HeaderComponent, FooterComponent, SidebarComponent } from './layout';
import { HttpService, LoggerService, CacheService, StorageService, TpiGlobalService, I18nService, I18nPipe } from './service';
import { loadSvgResources, loadIconFontResource } from '@utils';
import { MenuModule } from '../templet/menu/menu.module';
import { NzIconService } from 'ng-zorro-antd';

// components
const components = [
  HeaderComponent,
  FooterComponent,
  SidebarComponent
];

// services
const services = [
  LoggerService,
  CacheService,
  HttpService,
  StorageService,
  TpiGlobalService,
  I18nService
];

// pipes
const pipes = [
  I18nPipe
];

export const TransModule: ModuleWithProviders = TranslateModule.forChild({
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateHttpLoader),
    deps: [HttpClient]
  }
});

export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, constant.i18nFilePrefix, constant.i18nFileSuffix);
};

@NgModule({
  imports: [
    HttpClientModule,
    // HttpClientJsonpModule,//jsonp跨域
    SharedModule,
    BrowserAnimationsModule,
    MenuModule,
    TranslateModule.forRoot({
      // loader: {
      //   provide: TranslateLoader,
      //   useFactory: (createTranslateHttpLoader),
      //   deps: [HttpClient]
      // }
    })
  ],
  declarations: [
    ...components,
    ...pipes
  ],
  exports: [
    ...components,
    ...pipes
  ],
  providers: [
    ...services
  ]
})

export class CoreModule {


  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {CoreModule} [parentModule]
   * @memberof CoreModule
   */
  constructor(
    private logger: LoggerService,
    private $iconService: NzIconService,
    @Optional() @SkipSelf() parentModule: CoreModule,
    ir: MatIconRegistry,
    ds: DomSanitizer
  ) {
    // Optional() 可选参数,如果不存在,则正常构造,避免死循环
    // SkipSelf() 避免在本模块再次注入CoreModule,去父级寻找依赖
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }

    // 加载material svg图标
    loadSvgResources(ir, ds);

    // 加载iconfont svg图标
    //loadIconFontResource($iconService);

    this.logger.info('core', 'Initialize core module.');
  }
}
