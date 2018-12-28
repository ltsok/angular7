import { NgModule } from '@angular/core';

import { IntroductionRoutingModule } from './introduction-routing.module';
import { IntroductionComponent } from './introduction.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [IntroductionComponent],
  imports: [
    IntroductionRoutingModule,
    SharedModule
  ]
})
export class IntroductionModule { }
