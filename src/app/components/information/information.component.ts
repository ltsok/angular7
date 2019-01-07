import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-information',
  template: `
    <div class="content-header">
      <div class="header-cotainer">
        <h1>最新资讯</h1>
        <h1>LATEST INFORMATION</h1>
      </div>
    </div>
    <router-outlet></router-outlet>
  `
})
export class InformationComponent {

}
