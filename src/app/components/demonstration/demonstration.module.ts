import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemonstrationRoutingModule } from './demonstration-routing.module';
import { DemonstrationComponent } from './demonstration.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [DemonstrationComponent],
  imports: [
    CommonModule,
    DemonstrationRoutingModule,
    SharedModule
  ]
})
export class DemonstrationModule { }
