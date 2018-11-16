import { Routes } from '@angular/router';
import { HeroesComponent } from './heroes.component';

export const ROUTER_CONFIG: Routes = [
    {
        path: '',
        component: HeroesComponent
    }
];