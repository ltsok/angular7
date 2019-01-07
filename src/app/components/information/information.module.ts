import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationRoutingModule } from './information-routing.module';
import { InformationComponent } from './information.component';
import { SharedModule } from '@shared';
import { InformationListComponent } from './information-list/information-list.component';
import { InformationDetailComponent } from './information-detail/information-detail.component';

@NgModule({
  declarations: [
    InformationComponent,
    InformationDetailComponent,
    InformationListComponent
  ],
  imports: [
    CommonModule,
    InformationRoutingModule,
    SharedModule
  ]
})
export class InformationModule { }
