import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemonstrationRoutingModule } from './demonstration-routing.module';
import { DemonstrationComponent } from './demonstration.component';

@NgModule({
  declarations: [DemonstrationComponent],
  imports: [
    CommonModule,
    DemonstrationRoutingModule
  ]
})
export class DemonstrationModule { }
