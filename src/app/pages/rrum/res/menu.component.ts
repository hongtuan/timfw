import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { Ng2TreeSettings, TreeModel, NodeMenuItemAction, MenuItemSelectedEvent } from 'ng2-tree';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { PAGES_MENU, MenuItemAction } from './pages.menu';
// import { MENU_ITEMS } from './pages-menu';
// import { NodeMenuItemAction } from 'ng2-tree/src/menu/menu.events';
// import {  } from 'ng2-tree';
import { TreeUtils } from '../tree.utils';
import { AdminService} from '../../../services';
import { BaseComponent, BaseDialogComponent } from '../../../@theme/components';
import * as _ from 'lodash';

const enum MenuItemAction {
  AddBrother = '新增同级菜单',
  AddChild = '新增子菜单',
  Edit = '修改菜单',
  Remove = '删除菜单',
  View = '查看'
};

@Component({
  selector: 'menu-item',
  templateUrl: 'menu.item.html',
  styles: [`
    mat-form-field.mat-form-field {
      width: 100%;
      min-width: 100px;
    }
  `]
})
export class MenuItemComponent extends BaseDialogComponent implements OnInit {
  menuItem: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<MenuItemComponent>,
              protected elementRef: ElementRef) {
    super(dialog, dialogRef, elementRef);
  }

  ngOnInit() {
    // 如果注入了菜单数据
    if (this.data.menuItem) {
      // 使用注入的菜单数据
      this.menuItem = this.data.menuItem;
    } else {
      // 构建默认的菜单数据
      this.menuItem = {
        title: this.data.dlg_title === MenuItemAction.AddBrother ? '新兄弟菜单' : '新子菜单',
        link: '/pages/',
        icon: 'fa-file-o'
      };
    }
  }

  onSubmit() {
    // 回传菜单数据到上级界面即可。
    this.dialogRef.close(this.menuItem);
  }
}

@Component({
  selector: 'ngx-menu-tree',
  templateUrl: 'menu.component.html',
  styles: [`
    .tree-content {
      width: 100%;
      overflow: auto;
    }
  `]
})
export class MenuComponent extends BaseComponent implements OnInit {
  public settings: Ng2TreeSettings = {
    rootIsVisible: true
  };

  public showRootSettings: Ng2TreeSettings = {
    rootIsVisible: true
  };

  public hiddenRootSettings: Ng2TreeSettings = {
    rootIsVisible: false
  };

  constructor(protected dialog: MatDialog,
              private adminService: AdminService) {
    super(dialog);
  }

  private nodeMenuSetting: any = {
    isCollapsedOnInit: true,
    leftMenu: false,
    rightMenu: true,
    menuItems: [
      { action: NodeMenuItemAction.Custom, name: MenuItemAction.AddBrother, cssClass: 'fa fa-bars' },
      { action: NodeMenuItemAction.Custom, name: MenuItemAction.AddChild, cssClass: 'fa fa-sitemap' },
      { action: NodeMenuItemAction.Custom, name: MenuItemAction.Edit, cssClass: 'fa fa-edit' },
      { action: NodeMenuItemAction.Custom, name: MenuItemAction.Remove, cssClass: 'fa fa-trash-o' }
    ]
  };

  @ViewChild('menuTreeView') public menuTreeView;
  public menuTreeModel: TreeModel = {
    pid: -1, id: 0, th: 0, value: 'Root', children: []
  };



  public ngOnInit(): void {
    // TODO init task here.
    // this.parserTreeData();
    this.loadMenu();
  }

  public parserTreeData() {
    // const menuTree = TreeUtils.convertOldMenu(PAGES_MENU[0].children);
    /*
    _.each(menuTree.children, (menu1) => {
      menu1.settings = this.nodeMenuSetting;
    });//*/
    // this.menuTreeModel = menuTree;
    // console.log(JSON.stringify(menuTree, null, 2));
    // console.log(menuTree);
  }

  /*
  public loadMenuFromFile() {
    const menuTree = TreeUtils.convertMenuData(MENU_ITEMS);
    _.each(menuTree.children, (menu) => {
      menu.settings = this.nodeMenuSetting;
    });
    this.menuTreeModel = menuTree;
  }//*/

  public onMenuItemSelected(e: MenuItemSelectedEvent) {
    // SelectTreeComponent.logEvent(e, `You selected ${e.selectedItem} menu item,node:${e.node.id}`);
    const selectedMenu = e.selectedItem;
    const menuDataNode = e.node.node;
    let nextId = -1;
    let newNode;
    // 获取到树模型节点的引用。
    let nodeRef = TreeUtils.getNodeRefById(this.menuTreeModel, menuDataNode.id);
    // 获取到树节点的UI元素
    let treeCtrl = this.menuTreeView.getControllerByNodeId(menuDataNode.id);
    switch (selectedMenu) {
      case MenuItemAction.AddBrother:
        this.openDialog(MenuItemComponent, MenuItemAction.AddBrother, (menuItem) => {
          if (!menuItem) {
            return;
          }
          // 添加兄弟节点，需要找到当前节点的父节点
          nodeRef = TreeUtils.getNodeRefById(this.menuTreeModel, menuDataNode.pid);
          // 计算下一个ID
          nextId = TreeUtils.getNextChildId(nodeRef, menuDataNode.pid);
          // 构建新节点
          newNode = _.merge(menuItem, {
            pid: menuDataNode.pid, th: menuDataNode.th, id: nextId,
            value: menuItem.title, children: []
          });
          // 如果是为第一层树高节点增加兄弟节点,则需要获取到树的根节点
          if (e.node.parent.isRoot()) {
            // console.log('getController here.');
            treeCtrl = this.menuTreeView.getController();
          }else {
            // 获取到树节点的UI元素
            // console.log('getControllerByNodeId here.');
            treeCtrl = this.menuTreeView.getControllerByNodeId(menuDataNode.pid);
          }
          // 更新UI和树模型
          if (treeCtrl) {
            treeCtrl.addChild(newNode);
            TreeUtils.updateTreeModel(nodeRef, newNode);
            this.menuChanged = true;
          }
        });
        break;
      case MenuItemAction.AddChild:
        this.openDialog(MenuItemComponent, MenuItemAction.AddChild, (menuItem) => {
          if (!menuItem) {
            return;
          }
          // 根据当前节点id，计算下一个子节点id
          nextId = TreeUtils.getNextChildId(nodeRef, menuDataNode.id);
          // 构建新节点
          newNode = _.merge(menuItem, {
            pid: menuDataNode.id, th: menuDataNode.th + 1,
            id: nextId, value: menuItem.title, children: []
          });
          if (treeCtrl) {
            treeCtrl.addChild(newNode);
            TreeUtils.updateTreeModel(nodeRef, newNode);
            this.menuChanged = true;
          }
        });
        break;
      case MenuItemAction.Edit:
        // TODO edit menuItem here
        const data = {
          dlg_title: '修改菜单项',
          menuItem: {title: menuDataNode.value, icon: menuDataNode.icon, link: menuDataNode.link}
        };
        this.openDialog(MenuItemComponent, data, (menuItem) => {
          if (!menuItem) {
            return;
          }
          // TODO edit menu here.
          if (treeCtrl) {
            treeCtrl.rename(menuItem.title);
            if (nodeRef) {
              nodeRef.value = menuItem.title;
              nodeRef.title = menuItem.title;
              nodeRef.link = menuItem.link;
              nodeRef.icon = menuItem.icon;
            }
            this.menuChanged = true;
          }
        });
        break;
      case MenuItemAction.Remove:
        // TODO remove menuItem here
        if (nodeRef) {
          if (_.isArray(nodeRef.children) && !_.isEmpty(nodeRef.children)) {
            layer.alert('不允许删除分类！', {icon: 6});
            break;
          }
        }
        // 删除确认
        layerHelper.confirm('您确信要删除此菜单吗？', '删除确认',
          () => {
            // TODO remove menuItem here
            if (treeCtrl) {
              treeCtrl.remove();
              // 删除节点时，需要找到当前节点的父节点
              nodeRef = TreeUtils.getNodeRefById(this.menuTreeModel, menuDataNode.pid);
              // 然后更新父节点的孩子列表
              if (nodeRef) {
                _.remove(nodeRef.children, function (child) {
                  return child['id'] === menuDataNode.id;
                });
                this.menuChanged = true;
              }
              // layer.msg('菜单删除成功！');
            }
          }
        );
        break;
    }
  }

  loadMenu(): void {
    const menuName = 'ptMenu';
    this.adminService.loadMenu(menuName).subscribe(
      (menu) => {
        // 补齐数节点设置属性。
        _.each(menu.children, (node) => {
          node.settings = this.nodeMenuSetting;
        });
        this.menuTreeModel = menu;
      },
      (error) => {
        // console.log('load menu failed.', error);
        // layer.msg('load menu failed.');
      }
    );
  }

  private menuChanged = false;

  public isMenuChanged(): boolean {
    return this.menuChanged;
  }

  public saveMenu(): void {
    // console.log('save menu here.', this.menuTreeModel);
    // 需要去掉树上的setting.
    const menuConfig = {
      pid: -1,
      id: 0,
      th: 0,
      value: 'MenuRoot',
      link: '/pages',
      settings: {isCollapsedOnInit: false, leftMenu: false, rightMenu: false},
      children: []
    };

    _.each(this.menuTreeModel.children, function (node, index) {
      const tmpNode = {};
      _.each(node, function(value, key) {
        if (key !== 'settings') {
          tmpNode[key] = value;
        }
      });
      menuConfig.children.push(tmpNode);
    });
    // console.log(JSON.stringify(menuConfig, null, 2));
    const menuData = {menuName: 'ptMenu', menuConfig: menuConfig};
    this.adminService.saveMenu(menuData).subscribe(
      (menu) => {
        // console.log(menu);
        layer.msg('菜单保存成功。');
        this.menuChanged = false;
      },
      (error) => {
        // console.log(error);
        layer.msg('菜单保存失败！');
      }
    );
  }
}
