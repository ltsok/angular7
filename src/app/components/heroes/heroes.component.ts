
import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { HeroService } from './heroes.service';
import { AdItem, slideToRight  } from '@shared';
import { apiUrl } from '@core';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  animations: [
    slideToRight
  ]
})
export class HeroesComponent implements OnInit {

  @HostBinding('@routerAnim') state;
  ads: AdItem[];
  array = [1,2,3,4];
  selectData = [];
  selectedList = [
    {label: "l21", value: "l21"},
    {label: "v31", value: "v31"},
    // {label: "w32", value: "w32"},
    // {label: "g16", value: "g16"},
    // {label: "h17", value: "h17"},
    // {label: "c12", value: "c12"},
    // {label: "a10", value: "a10"},
    // {label: "b11", value: "b11"},
    // {label: "f15", value: "f15"}
  ];
  constructor(
    private heroservice: HeroService,
    @Inject(apiUrl) private url
  ) {
    console.log(url);
  }

  ngOnInit() {
    this.ads = this.heroservice.getAds();
    for (let i = 10; i < 20; i++) {
      this.selectData.push(
        { label: i.toString(36) + i, value: i.toString(36) + i }
      );
    }
  }

  changeData(): void {
    this.selectData = [];
    for (let i = 30; i < 50; i++) {
      this.selectData.push(
        { label: i.toString(36) + i, value: i.toString(36) + i }
      );
    }
  }

}
