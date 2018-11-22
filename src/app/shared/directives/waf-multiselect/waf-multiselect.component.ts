import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'waf-multiselect',
  templateUrl: './waf-multiselect.component.html',
  styleUrls: ['./waf-multiselect.component.scss']
})
export class WafMultiselectComponent implements OnInit {

  size = 'default';
  listOfOptions = [];
  selectOptions = [];

  constructor() { }

  ngOnInit() {
    const list = [], select = [];
    for (let i = 10; i < 17; i++) {
      list.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOptions = list;
    for (let i = 10; i < 110; i++) {
      select.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.selectOptions = select;
  }

}
