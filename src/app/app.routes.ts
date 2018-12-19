import { Routes } from '@angular/router';

export const ROUTER_CONFIG: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    { path: 'login', loadChildren: './components/login/login.module#LoginModule' },
    // { path: 'heroes', loadChildren: './components/heroes/heroes.module#HeroesModule' },
    { path: 'home', loadChildren: './components/homepage/homepage.module#HomepageModule' },
];
