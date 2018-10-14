import {Router} from '@angular/router';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
// import { Http } from '@angular/http';
import {Component, OnInit, ElementRef, ChangeDetectorRef} from '@angular/core';

import { AdminService } from '../../../services';
import { UserComponent, UserPasswordComponent, UserHospitalAssignComponent } from './components';
import {
  BaseListComponent,
  ButtonViewComponent,
  DateTimeViewComponent,
  SwitchViewComponent
} from '../../../@theme/components';
import {ServerDataSource} from 'ng2-smart-table';

@Component({
  selector: 'user-list',
  templateUrl: 'user.list.component.html',
})

export class UserListComponent extends BaseListComponent implements OnInit {
  constructor(private _elementRef: ElementRef,
              private router: Router, public http: HttpClient,
              private adminService: AdminService,
              public dialog: MatDialog, cdr: ChangeDetectorRef) {
    super(dialog, cdr);
    this.settings.columns = {
      _rid: {
        title: 'ID',
        sort: false,
        filter: false,
        width: '40px'
      },
      email: {
        title: '账号',
      },
      name: {
        title: '姓名',
      },
      status: {
        title: '状态',
        width: '100px',
        type: 'custom',
        renderComponent: SwitchViewComponent,
        onComponentInitFunction: (instance) => {
          instance.setConfig({
            onText: '正常', offText: '禁用',
            offColor: 'danger',
            onValue: 'valid', offValue: 'invalid',
            updateUrl: '/api/user/update',
            columnName: 'status',
            // afterUpdateCallback: () => { this.refreshTable(); }
          });
        }
      },
      updatedOn: {
        title: '更新时间',
        hidden: true,
        type: 'custom',
        width: '160px',
        renderComponent: DateTimeViewComponent,
      },
      expiredOn: {
        title: '到期时间',
        type: 'custom',
        width: '160px',
        renderComponent: DateTimeViewComponent,
      },
      operate: {
        title: '操作',
        sort: false,
        filter: false,
        width: '160px',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          const buttonConfig = [
            {title: '<i class="fa fa-edit" title="修改"></i>', method: 'openEditDlg'},
            {title: '<i class="fa fa-trash-o" title="删除"></i>', method: 'deleteUser'},
            {title: '<i class="fa fa-ellipsis-h" title="修改口令"></i>', method: 'updatePwd'},
            {title: '<i class="fa fa-h-square" title="分配医院"></i>', method: 'assignHospital'},
          ];
          instance.setButtonConfig(buttonConfig);
          instance.clickEvent.subscribe(row => {
            // It's cool!
            this[row.method](row.data);
          });
        }
      }
    };
    this.settings.pager.perPage = 5 ;
    this.fixedColumns = '_rid';
    this.initColumns();
    this.setColumns();
    const token = window.localStorage['auth_app_token'];
    this.source = new ServerDataSource(http,
      {endPoint: '/api/user/list', totalKey: 'totalCount', dataKey: 'rows'});
    this.source.setSort([{ field: 'updatedOn', direction: 'desc' }]);
    console.log('UserListComponent:constructor() called.');
  }

  ngOnInit(): void {
    console.log('UserListComponent:ngOnInit() called.');
  }
  refreshTable(): void {
    this.source.refresh();
  }

  openAddDlg(): void {
    const dialogRef = this.openDialog(UserComponent, '新增管理员');
    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        this.refreshTable();
      }
    });
  }

  openEditDlg(admin: any): void {
    this.openDialog(UserComponent,
      {dlg_title: '修改管理员', user: admin},
      (result) => { this.refreshTable(); }
    );
  }

  public deleteUser(admin): void {
    layerHelper.confirm(`您确认要删除${admin.name}？`, '删除确认', () => {
      this.adminService.deleteUser(admin._id).subscribe(
        (result) => {
          layer.msg('删除管理员成功!');
          this.refreshTable();
        },
        (error) => {
          console.log(error.message);
          layer.msg('删除管理员失败!');
        }
      );
    });
  }

  public updatePwd(admin): void {
    this.openDialog(UserPasswordComponent,
      {dlg_title: '修改管理员口令', user: admin}
    );
  }

  public assignHospital(admin): void {
    this.openDialog(UserHospitalAssignComponent,
      {dlg_title: '分配医院', user: admin}
    );
  }
}
