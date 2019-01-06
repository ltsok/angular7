import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchievementsRoutingModule } from './achievements-routing.module';
import { AchievementsComponent } from './achievements.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [AchievementsComponent],
  imports: [
    CommonModule,
    AchievementsRoutingModule,
    SharedModule
  ]
})
export class AchievementsModule { }
