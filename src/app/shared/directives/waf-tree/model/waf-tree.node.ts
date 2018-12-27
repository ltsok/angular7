import { NzTreeNode } from "ng-zorro-antd";
import { packDatasForZorro } from "../waf-tree.util";

export class WafTreeNode {

    constructor(id: string,
        name: string,
        children: Array<WafTreeNode> = [],
        isHide: boolean = false,
        frontIcon?: string,
        behindIcon?: string) {
        this.id = id;
        this.name = name;
        this.children = children;
        if (!children || children.length === 0) {
            this.isLeaf = true;
        } else {
            this.isLeaf = false;
        }
        this.isHide = isHide;
        this.frontIcon = frontIcon;
        this.behindIcon = behindIcon;
    }

    id: string;//节点id
    name: string;//节点名称
    isLeaf?: boolean;//节点是否是叶子
    isHide?: boolean;//节点是否隐藏
    checked?: boolean;//节点是否勾选中
    selected?: boolean;//节点select中
    expanded?: boolean;//节点是否展开
    frontIcon?: string;//节点前图标
    behindIcon?: string;//节点后图标
    children?: WafTreeNode[];//当前节点的子节点
    parentNode: WafTreeNode;//父级节点
    [key: string]: any;//自定义属性

    /**
     * 添加节点方法
     * @param childs 子节点数组 
     * @param index 插入节点所在位置，默认插入到结尾
     * @returns 成功失败
     */
    addChildren(childs: WafTreeNode[], index: number = -1): boolean {
        if (!childs) return false;

        try {
            //如果当前是叶子节点，将叶子节点的标志更新掉
            if (this.isLeaf) {
                this.isLeaf = false;
            }

            //如果当前节点的子节点数组为空，则给一个空数组
            if (!this.children) {
                this.children = [];
            }

            //判断是否给予了插入位置
            if (index === -1) {
                this.children = this.children.concat(childs);
            } else {
                let childPos = index;
                for (let i = 0; i < childs.length; i++) {
                    childs[i].parentNode = this;
                    this.children.splice(childPos, 0, childs[i]);
                    childPos++;
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * 根据节点id删除节点
     * @param delId 被删除节点的ID
     * @returns 成功失败
     */
    delChildById(delId: string): boolean {
        if (!delId || !this.children) return false;
        try {
            //先删除waftree的数据
            let wafIndex = -1;
            this.children.forEach((node: WafTreeNode, index: number) => {
                if (node.id === delId) {
                    wafIndex = index;
                    return;
                }
            });
            if (wafIndex > -1) {
                this.children.splice(wafIndex, 1);
                if (!this.children || this.children.length == 0) {//删除完成后，如果子节点没有，则标志该节点为叶子节点
                    this.isLeaf = true;
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * 清除所有子节点
     * @returns 成功、失败
     */
    clearChildren(): boolean {
        this.children = [];
        this.isLeaf = true;
        return true;
    }

    /**
     * 设置节点勾选
     * @param checked 当前节点是否勾选
     * @param halfChecked 父级节点是否半选
     */
    setChecked(checked: boolean = false): void {
        this.checked = checked;
    }

    /**
     * 设置节点展开
     * @param value 是否展开
     */
    setExpanded(value: boolean): void {
        this.expanded = value;
    }

    /**
     * 设置节点selected
     * @param value 是否选中
     */
    public setSelected(value: boolean): void {
        this.selected = value;
    }

    /**
     * 设置节点隐藏
     * @param value 
     */
    setHide(value: boolean): void {
        this.isHide = value;
    }

    /**
     * 获取当前节点的父级节点
     */
    getParentNode(): WafTreeNode {
        return this.parentNode;
    }

    /**
     * 获取当前节点的子节点数组
     */
    getChildren(): WafTreeNode[] {
        return this.children;
    }

}

export enum Status {
    isLeaf,
    checked,
    selected,
    halfChecked,
    expanded,
    like
}