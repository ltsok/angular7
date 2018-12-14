import { WafMenuService } from './waf-menu.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fat-menu-group-item',
  template: `
    <li class="group-item" [class.selected]="selectId === id" (click)="choseGroupItem()">
        {{title}}
        <ng-content></ng-content>
    </li>
  `,
  styleUrls: ['./waf-menu.component.scss']
})
export class FatMenuGroupItemComponent implements OnInit{
    
    @Input()
    rootId: any;
    @Input()
    title: any;
    public id: string;
    private selectId: string;

    constructor(private wafMenuService: WafMenuService) {
        this.id = this.wafMenuService.getuuid();
    }

    ngOnInit(): void {
        this.wafMenuService.$selectGroupSubject.subscribe((v)=>{
            this.selectId = v;
        });
    }

    choseGroupItem(): void {
        this.wafMenuService.$selectGroupSubject.next(this.id);
        this.wafMenuService.$selectSubject.next(this.rootId);
    }
}