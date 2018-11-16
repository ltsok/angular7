import { trigger, transition, animate, style, state, group } from "@angular/animations";

export const slideToRight = trigger('routerAnim', [
    // 容器为flex不就， 要用fixed定位，防止页面闪动
    state('void', style({position: 'fixed', width: '100%', height: '80%'})),
    state('void', style({position: 'fixed', width: '100%', height: '80%'})),
    transition('void => *', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(0%)'})),
            animate('.1s ease-in', style({opacity: 1}))
        ])
    ]),
    transition('* => void', [
        style({transform: 'translateX(0%)', opacity: 1}),
        group([
            animate('.5s ease-in-out', style({transform: 'translateX(100%)'})),
            animate('.1s ease-in', style({opacity: 0}))
        ])
        
    ])
]);