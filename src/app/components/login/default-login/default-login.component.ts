import { Component, OnInit, HostBinding } from '@angular/core';
import { slideToRight } from '@shared';

@Component({
  selector: 'app-login',
  templateUrl: './default-login.component.html',
  styleUrls: ['./default-login.component.scss'],
  animations: [
    slideToRight
  ]
})
export class DefaultLoginComponent implements OnInit {

  @HostBinding('@routerAnim') state;

  constructor() { }

  ngOnInit() {
  }

}
