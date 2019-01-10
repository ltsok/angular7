import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ContentChild, NgZone } from '@angular/core';
import { NzTreeNode, NzTreeComponent, NzFormatEmitEvent } from "ng-zorro-antd";
import { WafTreeNode, Status } from "./model/waf-tree.node";
import { WafTreeService } from './waf-tree.service';
import { packDatasForZorro } from './waf-tree.util';
import { HideDirective } from "./waf-tree.directive";
@Component({
  selector: 'waf-tree',
  templateUrl: './waf-tree.component.html',
  styleUrls: ['./waf-tree.component.scss']
})
export class WafTreeComponent implements OnInit {
  constructor(private wafTreeService: WafTreeService) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.setDisabledIds();
  }

  private wafTreeNodes: Array<WafTreeNode> = [];


  /**
   * 是否用默认的节点模板
   */
  isUseDefault: boolean = true;

  /**
   * 组件的宽度
   */
  @Input() width: number = 240;

  /**
   * 边框圆角值
   */
  @Input() borderRadius: string = '2px';

  private _wafTreeTemplate: TemplateRef<void>;
  @ContentChild('wafTreeNodeTemplet') set wafTreeTemplate(value: TemplateRef<void>) {
    if (!value) return;
    this.isUseDefault = false;
    this._wafTreeTemplate = value;
  }
  get wafTreeTemplate() {
    return this._wafTreeTemplate;
  }

  @ViewChild('nzTree') nzTree: NzTreeComponent;
  /**
   * 组件的数据源
   */
  _dataSource: Array<NzTreeNode> = [];
  isHideTree: boolean = true;
  @Output() dataSourceChange = new EventEmitter();
  @Input() set dataSource(value: Array<WafTreeNode>) {
    if (!Array.isArray(value) || value == this.wafTreeNodes) return;
    if (Array.isArray(value) && value.length > 0) {
      this.isHideTree = false;
    }
    let wafNodes: WafTreeNode[] = value;
    if (!value.some(item => item instanceof WafTreeNode)) {//当传过来的数据结构是js对象数组
      wafNodes = this.getWafNodesForObject(value);
    }
    this.wafTreeNodes = [];
    this.wafTreeNodes = wafNodes;
    this._dataSource = [];
    this._dataSource = packDatasForZorro(wafNodes, null);
    this.dataSourceChange.emit(this.wafTreeNodes);
    console.log(this._dataSource);
  }
  get dataSource() {
    return this.wafTreeNodes;
  }

  /**
   * 是否节点单勾选
   */
  private _isSingleChecked = false;
  @Input() set isSingleChecked(value: boolean) {
    if (value) {
      this.isCheckStrictly = true;
    }
    this._isSingleChecked = value;
  }
  get isSingleChecked() {
    return this._isSingleChecked
  }

  /**
   * 组件节点前是否显示勾选框
   */
  @Input() isShowCheckBox: boolean = false;

  /**
   * 是否显示展开图标
   */
  @Input() isShowExpandIcon: boolean = true;

  /**
   * 异步加载数据时是否显示loading样式
   */
  @Input() isAyncData: boolean = false;

  /**
   * 节点是否允许拖拽
   */
  @Input() isCanDraggable: boolean = false;

  /**
   * 是否通过名称搜索节点
   */
  @Input() isSearchName: boolean = false;

  /**
   * 是否可以选中多个节点
   */
  @Input() isMutiple: boolean = false;

  /**
   * Check模式下，父子节点勾选不再关联
   */
  @Input() isCheckStrictly: boolean = false;

  /**
 * Disabled模式下，父子节点勾选不再关联
 */
  @Input() isDisabledStrictly: boolean = false;
  /**
   * 是否展开全部节点
   */
  @Input() isExpandAll: boolean = false;

  /**
   * 节点禁用
   */
  private _disabledIds: string[] = null;
  @Input() set disabledIds(value: string[]) {
    if (!Array.isArray(value) || value.length == 0) return;
    this._disabledIds = value;
    if (Array.isArray(this._dataSource) && this._dataSource.length > 0) {
      this.setDisabledIds();
    }
  }
  get disabledIds() {
    return this._disabledIds;
  }

  private setDisabledIds() {
    if (Array.isArray(this._disabledIds) && this._disabledIds.length > 0) {
      this._disabledIds.forEach((id: string) => {
        this.setDisabled(id, true, false);
      });
    }
  }

  /**
   * 需要展开的节点id数组
   */
  private _expandIds: Array<string> = null;
  @Input() set expandIds(value: Array<string>) {
    if (!value) return;
    this._expandIds = value;
    this.expandIdsChange.emit(this._expandIds);
  }
  get expandIds() {
    return this._expandIds;
  }
  @Output() expandIdsChange = new EventEmitter();

  /**
   * 需要勾选中的节点id数组
   */
  private _checkedIds: string[] = null;
  @Input() set checkedIds(value: string[]) {
    if (!Array.isArray(value)) return;
    let ids: string[] = value;
    if (value.length > 0 && !this.isSingleChecked) {
      value.forEach((id: string) => {
        if (!Array.isArray(this.wafTreeNodes) || this.wafTreeNodes.length === 0) {
          return;
        }
        const wafNode: WafTreeNode = this.wafTreeService.getNodeById(id, this.wafTreeNodes);
        const loop = (children: WafTreeNode[]) => {
          if (Array.isArray(children) && children.length > 0) {
            children.forEach((child: WafTreeNode) => {
              if (ids.indexOf(child.id) == -1) {
                ids.push(child.id);
              }
              loop(child.getChildren());
            });
          }
        }
        if (wafNode) {
          loop(wafNode.getChildren());
        }
      });
    }
    this._checkedIds = ids;
    this.checkedIdsChange.emit(this._checkedIds);
  }

  get checkedIds() {
    return this._checkedIds;
  }
  @Output() checkedIdsChange = new EventEmitter();


  /**
   * 需要选中的节点id数组
   */
  private _selectedIds: Array<string> = null;
  @Input() set selectedIds(value: Array<string>) {
    if (!Array.isArray(value) || this._selectedIds == value) return;
    // if (!window.event || (window.event.type !== 'click' && window.event.srcElement.tagName !== 'span' && !window.event.srcElement.classList.contains('center'))) {
    value.forEach((id: string) => {
      this.searchExpand(id);
    });
    // }
    this._selectedIds = value;
    this.selectedIdsChange.emit(this._selectedIds);
  }
  get selectedIds() {
    return this._selectedIds;
  }
  @Output() selectedIdsChange = new EventEmitter();


  /**
   * 设置被隐藏的节点id数组
   */
  @Input() set hideIds(value: Array<string>) {
    if (!value || value.length === 0) return;
    const loopWaf = (ids: string[], datas: WafTreeNode[]) => {
      datas.forEach((node: WafTreeNode) => {
        if (ids.indexOf(node.id) > -1) {
          node.isHide = true;
          node.nzTreeNode.origin.isHide = true;
        }
        if (node.getChildren() && node.getChildren().length > 0) {
          loopWaf(ids, node.getChildren());
        }
      });
    }
    loopWaf(value, this.wafTreeNodes);

    const loopNz = (ids: string[], datas: NzTreeNode[]) => {
      datas.forEach((node: NzTreeNode) => {
        if (ids.indexOf(node.key) > -1) {
          node.origin.isHide = true;
        }
        if (node.getChildren() && node.getChildren().length > 0) {
          loopNz(ids, node.getChildren());
        }
      });
    }
    loopNz(value, this._dataSource);
  }

  @Input() isShowLine: boolean = false;

  /**
   * 是否显示节点前图标
   */
  @Input() isShowFrontIcon: boolean = false;

  /**
   * 是否显示节点后图标
   */
  @Input() isShowBehindIcon: boolean = false;

  /**
   * 外部查询节点名称，匹配节点名称（双向绑定）
   */
  _searchName: string = null;
  @Input() set searchName(value: string) {
    this._searchName = value;
    if (!this.isSearchName) {
      setTimeout(() => {
        if (value === '') {
          this.selectedIds = [];
          return;
        }
        const searchList = this.nzTree.getMatchedNodeList();
        let ids = [];
        searchList.forEach((node: NzTreeNode) => {
          ids.push(node.key);
        });
        this.selectedIds = ids.length > 0 ? ids : this.selectedIds;
      });
    }
  }
  get searchName() {
    return this._searchName;
  }

  /**
   * 节点点击事件
   */
  @Output() onClick = new EventEmitter();
  click(event: NzFormatEmitEvent) {
    if (!this.isMutiple) {
      this.selectedIds = [event.node.key];
    }
    //监听select事件实现selectedIds双向数据绑定
    if (Array.isArray(this.selectedIds) && this.selectedIds.length > 0) {
      this.selectedIds = this.proChange(this.selectedIds, event.node, 'isSelected');
    }
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    if (wafNode) {
      wafNode.setSelected(event.node.isSelected);
    }
    this.onClick.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点双击事件
   */
  @Output() onDbClick = new EventEmitter();
  dbClick(event: NzFormatEmitEvent) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onDbClick.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点右键点击事件
   */
  @Output() onContextClick = new EventEmitter();
  contextClick(event: NzFormatEmitEvent) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onContextClick.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点勾选框值改变事件
   */
  @Output() onCheckChange = new EventEmitter();
  checkChange(event: NzFormatEmitEvent) {
    if (this.isSingleChecked) {//当前是单选状态
      this.checkedIds = [event.node.key];
    } else {//当前是多选
      if (!Array.isArray(this.checkedIds) || this.checkedIds.length == 0) {
        this._checkedIds = [];
      }
      const node: NzTreeNode = event.node;
      this.setCheckedIds(node.isChecked, node);
    }
    const wafNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    if (wafNode) {
      wafNode.setChecked(event.node.isChecked);
    }
    this.onCheckChange.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点展开收起的改变事件
   */
  @Output() onExpandChange = new EventEmitter();
  expandChange(event: NzFormatEmitEvent) {
    if (this.isAyncData && event.node.isExpanded) {
      event.node.isLoading = true;
    }
    if (Array.isArray(this.selectedIds) && this.selectedIds.length > 0) {
      this.expandIds = this.proChange(this.expandIds, event.node, 'isExpanded');
    }
    const wafNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    if (wafNode) {
      wafNode.setExpanded(event.node.isExpanded);
    }
    this.onExpandChange.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点开始拖拽事件
   */
  @Output() onDragStart = new EventEmitter();
  dragStart(event) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onDragStart.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点dragenter事件（进入可放置的目标区）
   */
  @Output() onDragEnter = new EventEmitter();
  dragEnter(event) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onDragEnter.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点dragover事件（经过可放置的目标区）
   */
  @Output() onDragOver = new EventEmitter();
  dragOver(event) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onDragOver.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点dragleave事件（离开可放置的目标区）
   */
  @Output() onDragLeave = new EventEmitter();
  dragLeave(event) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onDragLeave.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点结束拖拽事件
   */
  @Output() onDragEnd = new EventEmitter();
  dragEnd(event) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onDragEnd.emit({ event: event.event, node: wafNode });
  }

  /**
   * 节点drop事件（放置在目标区）
   */
  @Output() onDrop = new EventEmitter();
  drop(event) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(event.node.key, this.wafTreeNodes);
    this.onDrop.emit({ event: event.event, node: wafNode });
  }

  @Output() frontIconClick: EventEmitter<any> = new EventEmitter();
  _frontIconClick(event: MouseEvent, nzTreeNode: NzTreeNode) {
    const wafNode = this.wafTreeService.getNodeById(nzTreeNode.key, this.wafTreeNodes);
    this.frontIconClick.emit({ event: event, node: wafNode });
  }

  @Output() behindIconClick: EventEmitter<any> = new EventEmitter();
  _behindIconClick(event: MouseEvent, nzTreeNode: NzTreeNode) {
    const wafNode = this.wafTreeService.getNodeById(nzTreeNode.key, this.wafTreeNodes);
    this.behindIconClick.emit({ event: event, node: wafNode });
  }

  /**
   * 模板返回WafTreeNode实例
   * @param node 
   */
  public getNeedWafTreeNode(node: NzTreeNode) {
    return this.wafTreeService.getNodeById(node.key, this.wafTreeNodes);
  }

  /**
   * 获取所有勾选中的节点
   */
  public getCheckedList(): WafTreeNode[] {
    return this.getNodesByType(Status.checked);
  }

  /**
     * 获取所有叶子节点
     * @param dataSource 
     */
  public getLeafNodes(): WafTreeNode[] {
    return this.getNodesByType(Status.isLeaf);
  }

  /**
     * 获取select中的节点
     * @param dataSource 
     */
  public getSelectedList(): Array<WafTreeNode> {
    return this.getNodesByType(Status.selected);
  }

  /**
   * 获取半勾选中的节点
   * @param dataSource 
   */
  public getHalfCheckedList(): Array<WafTreeNode> {
    return this.getNodesByType(Status.halfChecked);
  }

  /**
   * 获取展开状态的节点
   * @param dataSource 
   */
  public getExpandList(): Array<WafTreeNode> {
    return this.getNodesByType(Status.expanded);
  }

  /**
   * 获取模糊匹配的节点
   * @param dataSource 
   */
  public getMatchList(): Array<WafTreeNode> {
    return this.getNodesByType(Status.like);
  }

  /**
   * 设置节点勾选
   * @param id
   * @param checked 
   */
  public setChecked(id: string, checked: boolean) {
    this.wafTreeService.getNodeById(id, this.wafTreeNodes).setChecked(checked);
    if (this.isSingleChecked) {
      if (checked) {
        this.checkedIds = [id];
      } else {
        this.checkedIds = [];
      }
    } else {
      if (this.isCheckStrictly) {//父子无关联
        const currentNode: NzTreeNode = this.getNzNodeById(id);
        if (currentNode) {
          currentNode.setChecked(false);
        }
      } else {//父子有关联
        let index: number = -1;
        if (this.checkedIds && this.checkedIds.length > 0) {
          index = this.checkedIds.indexOf(id);
        }
        let ids: string[] = Array.isArray(this.checkedIds) && this.checkedIds.length > 0 ? [...this.checkedIds] : [];
        if (checked) {
          !Array.isArray(ids) || ids.length == 0 ? ids = [] : '';
          this.checkedIds = ids.concat(id);
        } else {
          this.removeCheckedOfStrictly(id);
        }
      }
    }
  }

  /**
   * 设置节点禁用
   * @param id 禁用节点id
   * @param disabled 
   */
  public setDisabled(id: string, disabled: boolean, isDisableCheckbox: boolean = false) {
    if (!Array.isArray(this.wafTreeNodes) || this.wafTreeNodes.length == 0) {
      return;
    }
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(id, this.wafTreeNodes);
    if (wafNode) {
      wafNode.setDisabled(disabled);
    }
    const currentNode: NzTreeNode = this.getNzNodeById(id);
    if (currentNode) {
      currentNode.isDisableCheckbox = disabled;
      if (!isDisableCheckbox) {
        currentNode.isDisabled = disabled;
      }
      if (!this.isDisabledStrictly) {
        this.setDisabledChildren(currentNode, disabled, isDisableCheckbox);
      }
    }
  }

  private setDisabledChildren(disabledNode: NzTreeNode, value: boolean, isDisableCheckbox: boolean) {
    const loopDisabled = (children: NzTreeNode[]) => {
      if (Array.isArray(children) && children.length > 0) {
        children.forEach((child: NzTreeNode) => {
          child.isDisableCheckbox = value;
          if (!isDisableCheckbox) {
            child.isDisabled = value;
          }
          loopDisabled(child.getChildren());
        });
      }
    }
    loopDisabled(disabledNode.getChildren());
  }

  /**
   * 设置节点selected
   * @param id 
   * @param selected 
   */
  public setSelected(id: string, selected: boolean) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(id, this.wafTreeNodes);
    if (wafNode) {
      wafNode.setSelected(selected);
    }
    this.searchNzTreeNode(id, 'select', selected);
  }

  /**
   * 设置节点展开
   * @param id 
   * @param expanded 
   */
  public setExpanded(id: string, expanded: boolean) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(id, this.wafTreeNodes);
    if (wafNode) {
      wafNode.setExpanded(expanded);
    }
    this.searchNzTreeNode(id, 'expand', expanded);
  }

  /**
   * 设置节点隐藏
   * @param id 
   * @param hide 
   */
  public setHide(id: string, hide: boolean) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(id, this.wafTreeNodes);
    if (wafNode) {
      wafNode.setHide(hide);
    }
    this.searchNzTreeNode(id, 'hide', hide);
  }

  /**
     * 清除所有子节点
     * @param id
     */
  public clearChildren(id: string) {
    const wafNode: WafTreeNode = this.wafTreeService.getNodeById(id, this.wafTreeNodes);
    if (wafNode) {
      wafNode.clearChildren();
    }
    this.searchNzTreeNode(id, 'clear');
  }

  /**
   * 给指定节点添加子节点数组
   * @param id 
   * @param children 
   * @param index 
   */
  public addChildren(id: string, children: WafTreeNode[], index: number = -1) {
    const currentNode: WafTreeNode = this.wafTreeService.getNodeById(id, this.wafTreeNodes);
    currentNode.addChildren(children, index);
    const loopNzNodes = (nodes: NzTreeNode[]) => {
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node: NzTreeNode) => {
          if (node.key === id) {
            if (node.isLeaf) {
              node.isLeaf = false;
            }
            let nzNodes: NzTreeNode[] = [];
            nzNodes = packDatasForZorro(children, currentNode);
            node.addChildren(nzNodes, index);
            return;
          }
          loopNzNodes(node.getChildren());
        });
      }
    }
    loopNzNodes(this._dataSource);
  }

  /**
   * 根据节点id删除节点
   * @param delId 
   */
  public delChildById(parentId: string, delId: string) {
    this.wafTreeService.getNodeById(parentId, this.wafTreeNodes).delChildById(delId);
    const loopNzNodes = (nodes: NzTreeNode[]) => {
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node: NzTreeNode) => {
          if (node.key === parentId) {
            let nzIndex = -1;
            node.children.forEach((child: NzTreeNode, index: number) => {
              if (child.key === delId) {
                nzIndex = index;
                return;
              }
            });
            if (nzIndex > -1) {
              node.children.splice(nzIndex, 1);
              if (!node.children || node.children.length == 0) {//删除完成后，如果子节点没有，则标志该节点为叶子节点
                node.isLeaf = true;
                node.origin.isLeaf = true;
              }
            }
            return;
          }
          loopNzNodes(node.getChildren());
        });
      }
    }
    loopNzNodes(this._dataSource);
  }


  /**
   * 在勾选和取消勾选操作时获取已勾选的节点id
   * @param checked 
   * @param node 
   */
  private setCheckedIds(checked: boolean, node: NzTreeNode) {
    if (checked) {//当前节点勾选中
      if (this._checkedIds.indexOf(node.key) === -1) {
        let addIds = [node.key];
        if (this._checkedIds.length > 0) {
          const loopUp = (parent: NzTreeNode) => {
            if (!parent) return;
            if (this._checkedIds.indexOf(parent.key) === -1 && parent.isChecked) {
              addIds.push(parent.key);
            }
            loopUp(parent.getParentNode());
          }
          loopUp(node.getParentNode());
        }
        this.checkedIds = this.checkedIds.concat(addIds);
      }
    } else {//当前取消勾选中
      let removeIds = [node.key];
      if (this._checkedIds.length === 0) {
        return;
      }
      const loopParent = (parent: NzTreeNode) => {
        if (!parent) return;
        if (parent.isHalfChecked) {
          removeIds.push(parent.key);
          loopParent(parent.getParentNode());
        }
      }
      loopParent(node.getParentNode());
      const loopChild = (nodes: NzTreeNode[]) => {
        if (Array.isArray(nodes) && nodes.length > 0) {
          nodes.forEach((child: NzTreeNode) => {
            removeIds.push(child.key);
            loopChild(child.getChildren());
          });
        }
      }
      loopChild(node.getChildren());
      removeIds.forEach((id: string) => {
        const index: number = this._checkedIds.indexOf(id);
        if (index > -1) {
          this._checkedIds.splice(index, 1);
        }
      });
    }
  }

  /**
   * 根据节点id展开父级节点
   * @param id 
   */
  private searchExpand(id: string): void {
    if (!id || id === '-1') {
      return;
    }
    const loopParent = (node: NzTreeNode) => {
      // expand parent node
      if (node.getParentNode()) {
        node.getParentNode().isExpanded = true;
        loopParent(node.getParentNode());
      }
    };
    const loopChild = (node: NzTreeNode) => {
      if (node.key === id) {
        loopParent(node);
        if (node.children && node.children.length > 0 && !this.isMutiple) {
          node.isExpanded = false;
        }
        node.isSelected = true;
      } else if (!this.isMutiple) {
        node.isExpanded = false;
        node.isSelected = false;
      }
      node.children.forEach(cNode => {
        loopChild(cNode);
      });
    };
    this._dataSource.forEach((node: NzTreeNode) => {
      loopChild(node);
    });
  }

  /**
   * 将js对象数组数据转成WafTreeNode对象数组
   * @param data 被转化的数据
   */
  private getWafNodesForObject(data: object[]) {
    const loop = (datas: object[]) => {
      if (!Array.isArray(datas) || datas.length == 0) return;
      let nodes: WafTreeNode[] = [];
      datas.forEach((item: object) => {
        let node: WafTreeNode = new WafTreeNode('', '');
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const element = item[key];
            if (key == 'children') {
              node[key] = loop(element);
              if (Array.from(element).length > 0) {
                node.isLeaf = false;
              } else {
                node.isLeaf = true;
              }
            } else {
              node[key] = element;
            }
          }
        }
        nodes.push(node);
      });
      return nodes;
    }
    return loop(data);
  }

  /**
   * 处理
   * @param ids 
   * @param nzNode 
   */
  private proChange(ids: string[], nzNode: NzTreeNode, type: string) {
    if (nzNode[type]) {
      ids = !ids ? [] : ids;
      if (ids.indexOf(nzNode.key) === -1) {
        ids = ids.concat([nzNode.key]);
      }
    } else {
      if (!Array.isArray(ids) || ids.length === 0) return ids;
      const index: number = ids.indexOf(nzNode.key);
      if (index > -1) {
        ids.splice(index, 1);
      }
    }
    return ids;
  }

  /**
   * 获取对应类型的节点数组
   * @param type 比如：叶子节点、勾选中、半选、select中、展开状态的、模糊匹配到的节点
   */
  private getNodesByType(type: Status): Array<WafTreeNode> {
    let nodes: WafTreeNode[] = [];
    let nzNodes: NzTreeNode[] = [];
    if (type === Status.checked) {//勾选节点
      nzNodes = this.nzTree.getCheckedNodeList();
    } else if (type === Status.selected) {//select中
      nzNodes = this.nzTree.getSelectedNodeList();
    } else if (type === Status.halfChecked) {//半选中
      nzNodes = this.nzTree.getHalfCheckedNodeList();
    } else if (type === Status.expanded) {//已展开的节点
      nzNodes = this.nzTree.getExpandedNodeList();
    } else if (type === Status.like) {//模糊匹配的节点
      nzNodes = this.nzTree.getMatchedNodeList();
    } else if (type === Status.isLeaf) {//叶子节点
      const loop = (datas: WafTreeNode[]) => {
        datas.forEach((node: WafTreeNode) => {
          if (node.isLeaf) {
            nodes.push(node)
          }
          loop(node.getChildren());
        });
      }
      loop(this.wafTreeNodes);
      return nodes;
    }
    nzNodes.forEach((nzNode: NzTreeNode) => {
      nodes.push(this.wafTreeService.getNodeById(nzNode.key, this.wafTreeNodes));
      if (type === Status.checked && !this.isSingleChecked) {
        const loop = (node: NzTreeNode) => {
          let children: NzTreeNode[] = node.getChildren();
          if (Array.isArray(children) && children.length > 0) {
            children.forEach((child: NzTreeNode) => {
              const wafNode: WafTreeNode = this.wafTreeService.getNodeById(child.key, this.wafTreeNodes);
              if (wafNode) {
                wafNode.setChecked(true);
                nodes.push(wafNode);
              }
              loop(child);
            });
          }
        }
        loop(nzNode);
      }
    });
    return nodes;
  }

  private searchNzTreeNode(id: string, type: string, value: any = null) {
    const loopNzNodes = (nodes: NzTreeNode[]) => {
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node: NzTreeNode) => {
          if (node.key === id) {
            if (type === 'clear') {
              node.clearChildren();
            } else if (type === 'select') {
              node.setSelected(value);
            } else if (type === 'expand') {
              node.setExpanded(value);
            } else if (type === 'hide') {
              node.origin.isHide = value;
            }
            return;
          }
          loopNzNodes(node.getChildren());
        });
      }
    }
    if (Array.isArray(this._dataSource) && this._dataSource.length > 0) {
      loopNzNodes(this._dataSource);
    }
  }

  /**
   * 根据节点id查找到相应NzTreeNode
   * @param id 
   */
  private getNzNodeById(id: string) {
    let result: NzTreeNode;
    const loopNzNodes = (nodes: NzTreeNode[]) => {
      if (Array.isArray(nodes) && nodes.length > 0) {
        nodes.forEach((node: NzTreeNode) => {
          if (node && node.key === id) {
            result = node;
            return;
          }
          loopNzNodes(node.getChildren());
        });
      }
    }
    loopNzNodes(this._dataSource);
    return result;
  }

  /**
   * 移除父子关联下勾选节点
   * @param id 
   */
  private removeCheckedOfStrictly(id: string) {
    let removeIds: string[] = [id];
    let isCheckedOfChild: boolean = false;
    //向下遍历子级
    const loopChildren = (children: NzTreeNode[], isChecked: boolean) => {
      if (Array.isArray(children) && children.length > 0) {
        children.forEach((item: NzTreeNode, index: number) => {
          if (isChecked) {
            if (item.isChecked) {
              isCheckedOfChild = true;
            }
          } else {
            item.setChecked(false);
            removeIds.push(item.key);
          }
          loopChildren(item.getChildren(), isChecked);
        })
      }
    }

    //向上遍历父级
    const loopParent = (parent: NzTreeNode) => {
      if (!parent) return;
      parent.setChecked(false, isCheckedOfChild);
      loopParent(parent.getParentNode());
    }

    //遍历查找到对应节点
    const currentNode: NzTreeNode = this.getNzNodeById(id);
    if (currentNode) {
      currentNode.setChecked(false);
      loopChildren(currentNode.getChildren(), false);
      const parent: NzTreeNode = currentNode.getParentNode();
      if (parent) {
        loopChildren(currentNode.getParentNode().getChildren(), true);
      }
      loopParent(currentNode.getParentNode());
    }

    //checkIds里对应的节点给清除
    if (Array.isArray(removeIds) && removeIds.length > 0) {
      removeIds.forEach((removeId) => {
        const index = this.checkedIds.indexOf(removeId);
        if (index > -1) {
          this.checkedIds.splice(index, 1);
        }
      })
    }
  }

}
