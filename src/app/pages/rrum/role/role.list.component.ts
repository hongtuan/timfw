import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Role } from '../../../domain/admin.mdl';
import { AdminService } from '../../../services/admin.service';
import { BaseComponent } from '../../../@theme/components';
import { RoleComponent, RoleMenuAssignComponent } from './components/role.component';

@Component({
  selector: 'ngx-role-list',
  templateUrl: 'role.list.component.html',
  styles: [`
    .list-content{
      width: 100%;
      overflow: auto;
    }
  `]
})
export class RoleListComponent extends BaseComponent implements OnInit {
  public roles: Role[];
  constructor(protected dialog: MatDialog, private adminService: AdminService) {
    super(dialog);
  }
  ngOnInit(): void {
    this.refreshList();
  }

  public refreshList(): void {
    this.adminService.loadRoles().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        // console.log(error);
        // layer.msg('load role failed.');
      }
    );
  }

  public addRole(): void {
    this.openDialog(RoleComponent,  '新增角色',
      (role) => {
      if (role) {
        this.roles.unshift(role);
      }
    });
  }

  public editRole(_role): void {
    const data = {
      dlg_title: '修改角色',
      role: _role
    };
    this.openDialog(RoleComponent, data, (role) => {
      if (role) {
        console.log('update role over.');
      }
    });
  }

  public deleteRole(_role): void {
    layerHelper.confirm(`您确认要删除${_role.roleName}？`, '删除确认', () => {
      const roleId = _role._id;
      this.adminService.deleteRole(roleId).subscribe(
        () => {
          this.refreshList();
          layer.msg('角色删除成功.');
        },
        () => {
          layer.msg('角色删除失败.');
        }
      );
    });
  }

  public assignMenu(role): void {
    const data = {dlg_title: `[${role.roleName}]菜单管理`, role: role};
    this.openDialog(RoleMenuAssignComponent, data);
  }
}


