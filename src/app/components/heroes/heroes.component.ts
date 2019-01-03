
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
  constructor(
    private heroservice: HeroService,
    @Inject(apiUrl) private url
  ) {
    console.log(url);
  }

  ngOnInit() {
    this.ads = this.heroservice.getAds();
  }

}
