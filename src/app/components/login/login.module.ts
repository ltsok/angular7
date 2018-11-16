import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DefaultLoginComponent } from './default-login/default-login.component';
import { SharedModule } from '@shared';
import { ROUTER_CONFIG } from './login.routes';
import { RegisterComponent } from './register/register.component';
import { RetrieveComponent } from './retrieve/retrieve.component';

@NgModule({
  imports: [
   SharedModule,
   RouterModule.forChild(ROUTER_CONFIG)
  ],
  declarations: [
    DefaultLoginComponent,
    RegisterComponent,
    RetrieveComponent
  ]
})
export class LoginModule { }
