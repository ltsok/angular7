import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { DefaultLoginComponent } from './default-login/default-login.component';


export const ROUTER_CONFIG: Routes = [
    {
        path: 'login',
        component: DefaultLoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
]
