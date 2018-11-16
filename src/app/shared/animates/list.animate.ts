import { trigger, transition, animate, style, state, group, query, stagger } from "@angular/animations";

export const listAnimation = trigger('listAnim', [
    transition('* => *', [
        query(':enter', style({opacity: 0})),
        query(':enter', stagger(100, [
           animate('1s', style({opacity: 1}))
        ])),
        query(':leave', style({opacity: 1})),
        query(':leave', stagger(100, [
            animate('1s', style({opacity: 0}))
        ])),
    ])
]);