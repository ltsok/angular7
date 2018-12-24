import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs';

import { Result } from '@shared';

import { Hero } from '../../mock/hero.model';
import { HeroJobAdComponent, HeroProfileComponent, AdItem } from '@shared';

@Injectable()
export class HeroService {

    constructor(
        private http: HttpService
    ) {}

    // getHeroes(): Observable<Hero> {
    //     return this.http.get('/heroes');
    // }

    getAds() {
        return [
            new AdItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' }),

            new AdItem(HeroProfileComponent, { name: 'Dr IQ', bio: 'Smart as they come' }),

            new AdItem(HeroJobAdComponent, {
                headline: 'Hiring for several positions',
                body: 'Submit your resume today!'
            }),

            new AdItem(HeroJobAdComponent, {
                headline: 'Openings in all departments',
                body: 'Apply today'
            }),
        ];
    }
}
