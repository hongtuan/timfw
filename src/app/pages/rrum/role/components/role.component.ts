import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Role } from '../../../../domain/admin.mdl';
import { AdminService } from '../../../../services/admin.service';
import { Ng2TreeSettings, NodeEvent} from 'ng2-tree';
import { TreeUtils } from '../../tree.utils';
import { BaseDialogComponent, DialogMode } from '../../../../@theme/components';
import * as _ from 'lodash';

@Component({
  selector: 'role-component',
  templateUrl: 'role.component.html',
  styles: [`
    mat-form-field.mat-form-field {
      width: 100%;
      min-width: 100px;
      max-width: 300px;
    }
  `]
})
export class RoleComponent extends BaseDialogComponent implements OnInit {

  public role: Role;
  public readonly roleTypeList = [
      {code: 'platform', name: '平台角色'},
      {code: 'org', name: '机构角色'}
  ];

  constructor(protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<RoleComponent>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private adminService: AdminService) {
    super(dialog, dialogRef, elementRef);
  }

  ngOnInit(): void {
    if (this.data.role) {
      // 使用注入的菜单数据
      this.role = this.data.role;
      this.dialogMode = DialogMode.Edit;
    } else {
      // 构建默认的菜单数据
      this.role = new Role({
        roleName: '新角色'
      });
    }
    console.log(JSON.stringify(this.role, null, 2));
  }

  onSubmit() {
    if (this.dialogMode === DialogMode.Add) {
      this.adminService.addRole(this.role).subscribe(
        (role) => {
          // 回传角色数据到上级界面
          this.dialogRef.close(role);
          // layer.msg('Role create over.');
        },
        (error) => {
          const errInfo = this.parserError(error);
          layer.msg(errInfo.message);
        }
      );
    }else {
      this.adminService.updateRole(this.role).subscribe(
        (role) => {
          this.dialogRef.close(null);
        },
        (error) => {
          const errInfo = this.parserError(error);
          layer.msg(errInfo.message);
        }
      );
    }
  }
}

@Component({
  selector: 'menu-preview',
  templateUrl: 'menu.preview.html',
  styles: [`
    .menuPreview {
      height: 320px;
    }
  `]
})
export class MenuPreviewComponent extends BaseDialogComponent implements OnInit {
  public menuData;
  constructor(protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<MenuPreviewComponent>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(dialog, dialogRef, elementRef);
  }

  ngOnInit(): void {
    if (this.data.menuData) {
      // 使用注入的菜单数据
      this.menuData = this.data.menuData;
      // console.log(this.menuData);
    }
  }
}

@Component({
  selector: 'role-menu-assign',
  templateUrl: 'role.menu.assign.html',
  styles: [`
    .tree-content {
      height: 320px;
    }
  `]
})
export class RoleMenuAssignComponent extends BaseDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('menuTreeView') public menuTreeView;
  public showRootSettings: Ng2TreeSettings = {
    rootIsVisible: true
  };
  public menuTreeModel;
  // public assignedMenuData;
  public role: Role;
  constructor(protected dialog: MatDialog,
              protected dialogRef: MatDialogRef<RoleMenuAssignComponent>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private adminService: AdminService) {
    super(dialog, dialogRef, elementRef);
  }

  loadMenu(): void {
    const menuName = 'ptMenu';
    this.adminService.loadMenu(menuName).subscribe(
      (menu) => {
        this.menuTreeModel = menu;
      },
      (error) => {
        // console.log('load menu failed.', error);
        // layer.msg('load menu failed.');
      }
    );
  }

  ngOnInit(): void {
    if (this.data.role) {
      // 使用注入的菜单数据
      this.role = this.data.role;
      // console.log(this.role);
    }
    this.loadMenu();
  }

  private unSelectAll() {
    // const selectedIds = [];
    const selectedNodes = TreeUtils.getSelectedNode(this.menuTreeModel);
    // console.log('selectedIds', selectedIds);
    _.each(selectedNodes, (node) => {
      const tc = this.menuTreeView.getControllerByNodeId(node.id);
      if (tc) {
        tc.select();
      }
    });
    // this.selectedNodes = [];
  }

  public setAuthMenu() {
    // this.unSelectAll();
    const selectedMenuIds = [];
    _.each(this.role.authMenuList, function (menu) {
      selectedMenuIds.push(menu.id);
    });
    // console.log('selectedMenuIds', selectedMenuIds);
    _.each(selectedMenuIds, (sid) => {
      const tc = this.menuTreeView.getControllerByNodeId(sid);
      if (tc) {
        tc.select();
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setAuthMenu();
    }, 500);
    super.ngAfterViewInit();
    console.log('RoleMenuAssignComponent ngAfterViewInit called.');
  }

  public onNodeSelected(e: NodeEvent): void {
    // console.log('node.value:', e.node.value);
    const nodeData = e.node.node;
    // update UI
    nodeData.selected = !nodeData.selected;
    // update model
    const nodeRef = TreeUtils.getNodeRefById(this.menuTreeModel, nodeData.id);
    if (nodeRef) {
      nodeRef.selected = nodeData.selected;
    }
  }

  preViewMenu() {
    // this.getSelectedNode();
    const selectedNodes = TreeUtils.getSelectedNode(this.menuTreeModel);
    const sortedSelectedNodes = TreeUtils.getRelatedSelectedNodes(this.menuTreeModel, selectedNodes);
    const treeModel = TreeUtils.buildTreeModel(sortedSelectedNodes);
    // 从this.newTreeModel 中提取menuData
    const assignedMenuData = TreeUtils.cvtTree2Menu(treeModel);
    const data = {
      dlg_title: `[${this.role.roleName}]菜单预览`,
      menuData: assignedMenuData
    };
    this.openDialog(MenuPreviewComponent, data);
  }

  saveRoleMenu() {
    // this.getSelectedNode();
    const selectedNodes = TreeUtils.getSelectedNode(this.menuTreeModel);
    // console.log('selectedNodes', selectedNodes);
    const assignedMenuList = [];
    _.each(selectedNodes, function(node){
      assignedMenuList.push({id: node.id, title: node.value});
    });
    // console.log('assignedMenuList', assignedMenuList);
    if (!_.isEmpty(assignedMenuList)) {
      this.adminService.updateRoleMenu(this.role._id, assignedMenuList).subscribe(
        (role) => {
          // this.close(null);
          // console.log(role, 'updateRoleMenu');
          this.role.authMenuList = role.authMenuList;
          layer.msg('updateRoleMenu over.');
        }
      );
    }else {
      layer.msg('未选中任何菜单。');
    }
  }
}
