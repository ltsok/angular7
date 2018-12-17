import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'waf-menu',
  template: `
    <ul class="fat-menu">
      <ng-content select="fat-menu-item"></ng-content>
    </ul>
  `,
  styleUrls: ['./waf-menu.component.scss']
})
export class WafMenuComponent {
}
