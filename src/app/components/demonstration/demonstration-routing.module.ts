import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemonstrationComponent } from './demonstration.component';

const routes: Routes = [
  {
    path: '',
    component: DemonstrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemonstrationRoutingModule { }
