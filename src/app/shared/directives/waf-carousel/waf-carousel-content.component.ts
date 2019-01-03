import { Component, Input } from '@angular/core';

@Component({
    selector: 'waf-carousel-content',
    template: `
        <li [style.width]="_width">
            <ng-content></ng-content>
        </li>
    `,
    styles: [ `
        li {
            float: left;
            height: 100%;
        }
    `
    ]
})

export class WafCarouselContentComponent {

    public _width: string;
    @Input()
    set width(v) {
        this._width = v;
    }
}