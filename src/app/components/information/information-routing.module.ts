import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformationComponent } from './information.component';
import { InformationDetailComponent } from './information-detail/information-detail.component';
import { InformationListComponent } from './information-list/information-list.component';

const routes: Routes = [
  {
    path: '',
    component: InformationComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: InformationListComponent
      },
      {
        path: 'detail',
        component: InformationDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationRoutingModule { }
