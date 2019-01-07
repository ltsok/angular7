import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  tabs = [
    '画室简介',
    '师资力量',
    '校园环境',
    '宿舍环境',
    '招生简章',
    '家长必读'
  ];

  constructor() { }

  ngOnInit() {
  }

}
