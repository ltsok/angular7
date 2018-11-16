import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  items: string[];

  constructor() { }

  ngOnInit() {
    const nums: number[] = [];
    for ( let i = 1; i < 33; i ++ ) {
      nums.push(i);
    }
    this.items = nums.map(d=>`avatars:svg-${d}`);
    
  }

}
