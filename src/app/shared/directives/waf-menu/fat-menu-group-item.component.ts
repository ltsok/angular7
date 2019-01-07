import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WafMenuService } from './waf-menu.service';

/**
 * 三级菜单
 * @export
 * @class FatMenuGroupItemComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'fat-menu-group-item',
  template: `
    <li class="group-item" [class.selected]="selectId == groupId" (click)="choseGroupItem()">
        {{title}}
        <ng-content></ng-content>
    </li>
  `,
  styleUrls: ['./waf-menu.component.scss']
})

export class FatMenuGroupItemComponent implements OnInit {
    
    /** 输入三级菜单名称 */
    @Input()
    title: string;

    /** 对外发送点击事件 */
    @Output()
    select: EventEmitter<any> = new EventEmitter<any>();

    /** 父级id */
    public parentId: string;

    /** 三级菜单组id */
    public groupId: string;

    /** 当前选中的三级菜单id */
    public selectId: string;


    /**
     * 构造函数
     * @param {WafMenuService} wafMenuService
     * @memberof FatMenuGroupItemComponent
     */
    constructor(private wafMenuService: WafMenuService) {
        this.groupId = this.wafMenuService.getuuid();
    }

    ngOnInit(): void {

        // 订阅三级菜单选中事件广播
        this.wafMenuService.$selectGroupSubject.subscribe((v)=>{
            this.selectId = v;
        });
    }


    /**
     * 三级菜单选中事件
     * @memberof FatMenuGroupItemComponent
     */
    choseGroupItem(): void {
        this.wafMenuService.$selectGroupSubject.next(this.groupId);
        this.wafMenuService.$selectSubject.next(this.parentId);
    }
}