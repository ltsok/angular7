import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ROUTER_CONFIG } from './heroes.routes';
import { HeroesComponent } from './heroes.component'
import { HeroService } from './heroes.service';
import { apiUrl } from '@core';

import { HeroJobAdComponent, HeroProfileComponent, AdItem, SharedModule } from '@shared';
import { NzIconService } from 'ng-zorro-antd';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  declarations: [HeroesComponent],
  providers: [
    HeroService,
    NzIconService,
    { provide: apiUrl, useValue: 'ltsokla' }
  ],
  entryComponents: [HeroJobAdComponent, HeroProfileComponent]
})
export class HeroesModule { }
