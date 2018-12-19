import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroductionRoutingModule } from './introduction-routing.module';
import { IntroductionComponent } from './introduction.component';

@NgModule({
  declarations: [IntroductionComponent],
  imports: [
    CommonModule,
    IntroductionRoutingModule
  ]
})
export class IntroductionModule { }
