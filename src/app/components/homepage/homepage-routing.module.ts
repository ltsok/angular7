import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage.component';
import { LoggerService } from '@core';
import { constant } from './homepage.constant';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomepageRoutingModule {

  constructor(private log: LoggerService) {
    this.log.info(constant.identifier, 'Initialize homepage module');
  }
}
