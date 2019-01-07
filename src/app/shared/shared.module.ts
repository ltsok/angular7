import { WafMenuService } from './directives/waf-menu/waf-menu.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { directives } from './directives';
import { LoggerService } from './../core/service/logger/logger.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';

// import {
//   MatToolbarModule,
//   MatIconModule,
//   MatButtonModule,
//   MatCardModule,
//   MatInputModule,
//   MatListModule,
//   MatSlideToggleModule,
//   MatGridListModule,
//   MatDialogModule,
//   MatAutocompleteModule,
//   MatMenuModule,
//   MatCheckboxModule,
//   MatTooltipModule,
//   MatSidenavModule,
//   MatProgressSpinnerModule,
// } from '@angular/material';
import { WafTreeService } from './directives/waf-tree/waf-tree.service';


const matModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  // MatToolbarModule,
  // MatIconModule,
  // MatButtonModule,
  // MatCardModule,
  // MatInputModule,
  // MatListModule,
  // MatSlideToggleModule,
  // MatGridListModule,
  // MatDialogModule,
  // MatAutocompleteModule,
  // MatMenuModule,
  // MatCheckboxModule,
  // MatTooltipModule,
  // MatSidenavModule,
  // MatProgressSpinnerModule
];

const zorroModules = [
  NgZorroAntdModule
];


@NgModule({
  imports: [
    ...matModules,
    ...zorroModules
  ],
  declarations: [
    ...directives,
  ],
  exports: [
    ...matModules,
    ...zorroModules,
    ...directives
  ],
  providers: [
    WafMenuService,
    WafTreeService
  ]
})
export class SharedModule {

  constructor(
    private logger: LoggerService
  ) {
    this.logger.info('sharee', 'Initialize shared module.');
  }
}
