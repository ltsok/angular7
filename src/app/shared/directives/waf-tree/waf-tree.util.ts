import { WafTreeNode } from "./model/waf-tree.node";
import { NzTreeNode } from "ng-zorro-antd";
/**
* 将WafTreeNode转成NzTreeNode的循环递归方法
* @param datas 被转化的数据源
* @param result 转化后的数据
* @param parentNode 当前转化节点的父级节点
* @returns 返回组装完成后的数据
*/
export function packDatasForZorro(datas: Array<WafTreeNode>,  parentNode: WafTreeNode): Array<NzTreeNode> {
    let result: Array<NzTreeNode>=[];
    const loop = (nodes, parentNode) => {
        let wafNodes = [];
        if (!nodes) return wafNodes;
        nodes.forEach((node: WafTreeNode) => {
            let option = { key: '', title: '' };
            node.parentNode = parentNode;
            for (const key in node) {
                if (node.hasOwnProperty(key)) {
                    const element = node[key];
                    if (key === 'id') {
                        option.key = element;
                    } else if (key === 'name') {
                        option.title = element;
                    } else if (key === 'children') {
                        option[key] = loop(element, node);
                    } else {
                        option[key] = element;
                    }
                }
            }
            let nzNode: NzTreeNode = new NzTreeNode(option);
            wafNodes.push(nzNode);
        });
        return wafNodes;
    }
    result = loop(datas, parentNode);
    return result;
}

