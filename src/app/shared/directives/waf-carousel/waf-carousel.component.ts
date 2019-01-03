import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { WafCarouselContentComponent } from './waf-carousel-content.component';

@Component({
  selector: 'waf-carousel',
  templateUrl: './waf-carousel.component.html',
  styleUrls: ['./waf-carousel.component.scss']
})
export class WafCarouselComponent implements AfterViewInit, AfterContentInit {

  /** 获取轮播容器元素 */
  @ViewChild('carousel')
  carouselEle: ElementRef;

  /** 获取轮播内容列表 */
  @ViewChild('list')
  listEle: ElementRef;

  /** 获取轮播子组件 */
  @ContentChildren(WafCarouselContentComponent)
  contentComponents: QueryList<any>;

  /** 轮播容器元素 */
  carouselElement: HTMLElement;

  /** 轮播列表元素 */
  listElement: HTMLElement;

  /** 轮播容器left */
  listLeft: number = 0;

  /** 选中项下标 */
  chosedIndex: number = 0;

  contentList: QueryList<any>;

  /** 轮播容器宽度 */
  carouselWidth:string;

  /** 轮播容器宽度取整数 */
  intWidth:number;

  /** 轮播列表元素宽度 */
  listWidth:string;

  contentLength:number = 5;

  constructor(
    private renderer2: Renderer2
  ) { }

  ngAfterContentInit(): void {
    console.log(this.contentComponents);
  }

  ngAfterViewInit(): void {

    this.listElement = this.listEle.nativeElement;
    this.carouselElement = this.carouselEle.nativeElement;
    this.carouselWidth = this.carouselElement.offsetWidth + 'px';
    this.intWidth = parseInt(this.carouselWidth);
    this.listWidth = this.contentLength * parseInt(this.carouselWidth) + 'px';
    this.renderer2.setStyle(this.listElement, 'width', this.listWidth);

    setTimeout(()=>{
      this.contentList = this.contentComponents;
    });
    this.contentComponents.forEach((item)=>{
      setTimeout(()=>{
        item._width = this.carouselWidth;
      });
    });

  }
  

  /**
   * 轮播上一次
   * @memberof WafCarouselComponent
   */
  previous(): void {
    
    this.listLeft = this.listElement.style.left ? parseInt(this.listElement.style.left) : 0;
    this.listLeft += this.intWidth;
    this.chosedIndex --;
    if (this.listLeft === this.intWidth) {
      this.listLeft = -(this.contentLength - 1) * this.intWidth;
      this.chosedIndex = this.contentLength - 1;
    }
    this.renderer2.setStyle(this.listElement, 'left', `${this.listLeft}px`);
    console.log('left: ',this.listLeft,'index: ', this.chosedIndex);
  }

  
  /**
   * 轮播前一次
   * @memberof WafCarouselComponent
   */
  next(): void {

    this.listLeft = this.listElement.style.left ? parseInt(this.listElement.style.left) : 0;
    this.listLeft -= this.intWidth;
    this.chosedIndex ++;
    if (this.listLeft === -this.contentLength * this.intWidth) {
      this.listLeft = 0;
      this.chosedIndex = 0;
    }
    this.renderer2.setStyle(this.listElement, 'left', `${this.listLeft}px`);
    console.log('left: ',this.listLeft,'index: ', this.chosedIndex);
  }


  /**
   * 按下标轮播
   * @param {number} index
   * @memberof WafCarouselComponent
   */
  choseItem(index: number): void {

    this.chosedIndex = index;
    this.listLeft = this.intWidth * index;
    this.renderer2.setStyle(this.listElement, 'left', `-${this.listLeft}px`);
  }

}
