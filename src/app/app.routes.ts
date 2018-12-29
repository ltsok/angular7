import { Routes } from '@angular/router';

export const ROUTER_CONFIG: Routes = [
    // { path: 'login', loadChildren: './components/login/login.module#LoginModule' },
    { path: '', redirectTo: 'heroes', pathMatch: 'full'},
    { path: 'heroes', loadChildren: './components/heroes/heroes.module#HeroesModule' },
    { path: 'home', loadChildren: './components/homepage/homepage.module#HomepageModule' },
    { path: 'introduction', loadChildren: './components/introduction/introduction.module#IntroductionModule' },
    { path: 'information', loadChildren: './components/information/information.module#InformationModule' },
    { path: 'achievements', loadChildren: './components/achievements/achievements.module#AchievementsModule' },
    { path: 'demonstration', loadChildren: './components/demonstration/demonstration.module#DemonstrationModule' },
    { path: 'contact', loadChildren: './components/contact/contact.module#ContactModule' }
];
