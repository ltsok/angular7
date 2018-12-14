import { WafMenuService } from './waf-menu.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fat-menu-item',
  template: `
    <li class="menu-item" [class.active]="rootId === selectedId">
        <div class="menu-title" (click)="choseItem();">
            {{title}}
            <ng-content></ng-content>
        </div>
        <div class="sub-menu">
            <div class="sub-menu-container">
                <ul>
                    <ng-content select="fat-menu-group"></ng-content>
                </ul>
            </div>
        </div>
    </li>
  `,
  styleUrls: ['./waf-menu.component.scss']
})
export class FatMenuItemComponent implements OnInit {

    @Input()
    rootId: any;
    @Input()
    title: any;
    private selectedId: string;

    constructor(private wafmenuService: WafMenuService) {
    }

    ngOnInit(): void {
        this.wafmenuService.$selectSubject.subscribe((v)=>{
            this.selectedId = v;
        });
    }

    choseItem(): void {
        this.wafmenuService.$selectSubject.next(this.rootId);
    }
}