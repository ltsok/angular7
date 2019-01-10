import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExcellentworksRoutingModule } from './excellentworks-routing.module';
import { ExcellentworksComponent } from './excellentworks.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [ExcellentworksComponent],
  imports: [
    CommonModule,
    ExcellentworksRoutingModule,
    SharedModule
  ]
})
export class ExcellentworksModule { }
