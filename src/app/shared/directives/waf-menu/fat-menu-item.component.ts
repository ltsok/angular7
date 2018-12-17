import { Component, OnInit, Input, AfterContentInit, ContentChildren, QueryList, Output, EventEmitter, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FatMenuGroupComponent } from './fat-menu-group.component';
import { WafMenuService } from './waf-menu.service';


/**
 * 一级菜单
 * @export
 * @class FatMenuItemComponent
 * @implements {OnInit}
 * @implements {AfterContentInit}
 */
@Component({
  selector: 'fat-menu-item',
  template: `
    <li class="menu-item" [class.active]="rootId === selectedId" (mouseenter)="showSub();" #rootMenuItem>
        <div class="menu-title" (click)="choseItem();">
            {{title}}
            <ng-content></ng-content>
        </div>
        <div class="sub-menu" #subMenuItem>
            <div class="sub-menu-container">
                <ul>
                    <ng-content select="fat-menu-group"></ng-content>
                </ul>
            </div>
        </div>
    </li>
  `,
  styleUrls: ['./waf-menu.component.scss']
})

export class FatMenuItemComponent implements OnInit, AfterContentInit {

    /** 一级菜单名称 */
    @Input()
    title: string;
    
    /** 对外发送点击事件 */
    @Output()
    select: EventEmitter<any> = new EventEmitter<any>();

    /** ng-content内投射的组件集合 */
    @ContentChildren(FatMenuGroupComponent)
    childrenCpm: QueryList<FatMenuGroupComponent>

    /** 一级菜单 */
    @ViewChild('rootMenuItem')
    private rootMenu: ElementRef;

    /** 二级子菜单 */
    @ViewChild('subMenuItem')
    private subMenu: ElementRef;

    /** 一级菜单对应的id */
    private rootId: string;
    
    /** 当前选中的一级菜单id */
    private selectedId: string;
    
    /**
     * 构造函数
     * @param {WafMenuService} wafmenuService
     * @param {Renderer2} render2
     * @memberof FatMenuItemComponent
     */
    constructor(private wafmenuService: WafMenuService, private render2: Renderer2) {
        this.rootId = this.wafmenuService.getuuid();
    }

    /**
     * 订阅一级菜单点击事件
     * @memberof FatMenuItemComponent
     */
    ngOnInit(): void {
        this.wafmenuService.$selectSubject.subscribe((v)=>{
            this.selectedId = v;
        });
    }

    /**
     * 为二级菜单添加parentId与一级菜单关联
     * @memberof FatMenuItemComponent
     */
    ngAfterContentInit(): void {
        this.childrenCpm.forEach((item: FatMenuGroupComponent, index: number, array: FatMenuGroupComponent[])=>{
            array[index].parentId = this.rootId;
        });
    }

    showSub(): void {

        // 一级菜单项元素
        let rootMenuEle = this.rootMenu.nativeElement as HTMLElement;

        // 页面可视区宽度
        let visualWidth = document.body.offsetWidth,

        // 一级菜距离左侧的距离
            rootMenuLeft = rootMenuEle.getBoundingClientRect().left,

        // 一级菜距离右侧的距离
            rootMenuRight = visualWidth - rootMenuEle.getBoundingClientRect().right,

        // 二级菜单项元素
            subMenuEle = this.subMenu.nativeElement as HTMLElement;


        // 一级菜单项宽度
        let rootMenuWidth = rootMenuEle.offsetWidth,

        // 二级菜单项宽度
            subMenuWidth = subMenuEle.offsetWidth;
        
        // 二级菜单靠左显示占用宽度
        let occupancyLeftWidth = subMenuWidth + rootMenuLeft,

        // 二级菜单靠右显示占用宽度
            occupancyRightWidth = subMenuWidth + rootMenuRight;

        
        // 靠左显示
        if ( occupancyLeftWidth <= visualWidth ) {
            this.render2.setStyle(this.subMenu.nativeElement, 'left', '0');
        }

        // 靠右显示
        if (occupancyLeftWidth > visualWidth && occupancyRightWidth <= visualWidth) {
            let left = '-' + (subMenuWidth - rootMenuWidth) + 'px';
            this.render2.setStyle(this.subMenu.nativeElement, 'left', left);
        }

        // 居中显示
        if (occupancyLeftWidth > visualWidth && occupancyRightWidth > visualWidth) {
            let left = '-' + (subMenuWidth / 2 - rootMenuWidth / 2) + 'px';
            this.render2.setStyle(this.subMenu.nativeElement, 'left', left);
        }
    }

    /**
     * 一级菜单点击事件
     * @memberof FatMenuItemComponent
     */
    choseItem(): void {
        this.wafmenuService.$selectSubject.next(this.rootId);
        this.wafmenuService.$selectGroupSubject.next('');
    }

}
