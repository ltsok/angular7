import { Component, OnInit, Input } from '@angular/core';
import { WafMenuService } from './waf-menu.service';

@Component({
  selector: 'fat-menu-group',
  template: `
    <li class="third-item">
      <ul class="third-item-container">
        <li class="title" (click)="choseGroupTitle();">
          {{title}}
          <ng-content></ng-content>
        </li>
        <ng-content select="fat-menu-group-item"></ng-content>
      </ul>
    </li>
  `,
  styleUrls: ['./waf-menu.component.scss']
})
export class FatMenuGroupComponent {

  @Input()
  rootId: any;
  @Input()
  title: any;
  public id: string;

  constructor(private wafMenuService: WafMenuService) {
    this.id = this.wafMenuService.getuuid();
  }

  choseGroupTitle(): void {
    this.wafMenuService.$selectSubject.next(this.rootId);
  }
}