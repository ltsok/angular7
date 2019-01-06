import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {
  pageIndex:number = 1;

  constructor() { }

  ngOnInit() {
  }

  jump(): void {
    console.log(this.pageIndex);
  }
}
