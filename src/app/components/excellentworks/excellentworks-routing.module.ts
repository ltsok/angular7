import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExcellentworksComponent } from './excellentworks.component';

const routes: Routes = [
  {
    path: '',
    component: ExcellentworksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExcellentworksRoutingModule { }
