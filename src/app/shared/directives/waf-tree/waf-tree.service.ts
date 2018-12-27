import { Injectable } from "@angular/core";
import { WafTreeNode, Status } from "./model/waf-tree.node";
import { NzTreeNode } from "ng-zorro-antd";

@Injectable()
export class WafTreeService {

    constructor() { }

    num = 0;
    /**
     * 根据节点id获取到节点实例对象
     * @param id 要查找的节点id
     * @param dataSource 被查找的数据源
     * @returns 找到的节点实例对象
     */
    public getNodeById(id: string, dataSource: WafTreeNode[] | any): WafTreeNode {
        if (!id || !dataSource || dataSource.length === 0) return null;
        let result: WafTreeNode = null;
        const loop = (id: string, datas: WafTreeNode[]) => {
            this.num++;
            datas.forEach((node: WafTreeNode) => {
                if (node.id === id) {
                    result = node;
                    return;
                }
                const children = node.getChildren();
                if (!children || children.length === 0) return;
                loop(id, children);
            });
        }

        loop(id, dataSource);
        return result;
    }

    /**
     * 根据相应的条件向上或向下遍历返回需要的节点
     * @param node 
     * @param isUp 
     * @param key 
     * @param value 
     */
    public getNodeByCondtion(node: WafTreeNode, isUp: boolean = false, key: string, value: any): WafTreeNode[] {
        let result: WafTreeNode[] = [];
        if (!node || !key) {
            return result;
        }
        if (node[key] === value) {
            result.push(node);
        }
        //向上遍历查找
        const traversalUP = (n: WafTreeNode) => {
            if (!n) return;
            let parentNode: WafTreeNode = n.getParentNode();
            if (n == node) {
                parentNode = n.getParentNode().getParentNode();
            }
            if (!parentNode) {
                if (n[key] === value) {
                    result.push(n);
                    return;
                }
            }
            parentNode.getChildren().forEach((item: WafTreeNode) => {
                if (item[key] === value && item != node) {
                    result.push(item);
                }
            })
            traversalUP(parentNode);
        }
        //向下遍历查找
        const traversalDown = (n: WafTreeNode) => {
            const children: Array<WafTreeNode> = n.getChildren();
            if (children && children.length > 0) {
                children.forEach((item: WafTreeNode) => {
                    if (item[key] === value) {
                        result.push(item);
                    }
                    traversalDown(item);
                })
            }
        }

        if (isUp) {
            traversalUP(node);
        } else {
            traversalDown(node);
        }
        return result;
    }
}