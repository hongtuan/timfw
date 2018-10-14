import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ApiConfigDialogForm, ExternalPageDlg } from './components';

import { HttpClient } from '@angular/common/http';
import { ServerDataSource } from 'ng2-smart-table';
import { BaseListComponent, ButtonViewComponent, DateViewComponent, DateTimeViewComponent,
  SwitchViewComponent, SelectViewComponent } from '../../@theme/components';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'apimgr-list',
  templateUrl: 'apimgr.component.html',
})
export class ApiMgrComponent extends BaseListComponent implements OnInit {
  // constructor(httpClient: HttpClient, public dialog: MatDialog) {
  constructor(private route: ActivatedRoute,
              private router: Router, public http: HttpClient,
              public dialog: MatDialog, cdr: ChangeDetectorRef) {
    super(dialog, cdr);
    this.settings.columns = {
      _rid: {
        title: 'ID',
        sort: false,
        filter: false,
        width: '40px'
      },
      name: {
        title: '名称',
      },
      reqType: {
        title: '请求方式',
        type: 'custom',
        width: '80px',
        renderComponent: SelectViewComponent,
        onComponentInitFunction: (instance) => {
          instance.setConfig({
            columnName: 'reqType',
            list: [
              {value: 'get', title: 'Get'},
              {value: 'post', title: 'Post'},
              {value: 'put', title: 'Put'},
              {value: 'delete', title: 'Delete'},
            ],
            updateUrl: '/api/apimgr/update',
            afterUpdateCallback: () => { this.refreshTable(); },
            // needConfirm: 'no'
          });
        }
      },
      url: {
        title: 'url',
        width: '240px',
      },
      testResult: {
        title: '测试结果',
        width: '100px',
        type: 'custom',
        renderComponent: SwitchViewComponent,
        onComponentInitFunction: (instance) => {
          instance.setConfig({
            onText: '通过', offText: '失败',
            offColor: 'danger',
            onValue: 'passed', offValue: 'failed',
            updateUrl: '/api/apimgr/update',
            columnName: 'testResult',
            afterUpdateCallback: () => { this.refreshTable(); }
          });
        }
      },
      updatedOn: {
        title: '最近更新/测试时间',
        type: 'custom',
        width: '160px',
        renderComponent: DateTimeViewComponent,
        hidden: true,
      },
      auth: {
        title: '作者',
        // hidden: true,
        width: '80px',
      },
      testTimes: {
        title: '测试次数',
        width: '80px',
        hidden: true,
      },
      operate: {
        title: '操作',
        width: '160px',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          // console.log('onComponentInitFunction called.');
          const buttonConfig = [
            // {title: '对话框', method: 'dlgDemo'},
            {title: '<i class="fa fa-check-square" aria-hidden="true"></i>', method: 'doTest', tip: 'testApi'},
            {title: '<i class="fa fa-edit"></i>', method: 'openEditDlg', tip: 'modifyApi'},
            {title: '<i class="fa fa-trash-o"></i>', method: 'removeApi', tip: 'deleteApi',
              hiddenCondition: [{field: 'testResult', match: 'ueq', value: 'passed'}]},
          ];
          instance.setButtonConfig(buttonConfig);
          instance.clickEvent.subscribe(row => {
            // It's cool!
            // this[row['method']](row['data']);
            this[row.method](row.data);
          });
        }
      }
    };
    this.fixedColumns = '_rid';
    this.initColumns();
    this.setColumns();
    this.source = new ServerDataSource(http,
      {endPoint: '/api/apimgr/list', totalKey: 'totalCount', dataKey: 'rows'});
    this.source.setSort([{ field: 'updatedOn', direction: 'desc' }]);
  }


  ngOnInit(): void {
  }

  refreshTable(): void {
    console.log('refreshTable called.');
    this.source.refresh();
  }

  openAddDlg(): void {
    const dialogRef = this.openDialog(
      ApiConfigDialogForm,
      '新增Api',
      (result) => {
        if (result) this.refreshTable();
      }
    );
  }

  openEditDlg(row: any): void {
    const dialogRef = this.openDialog(
      ApiConfigDialogForm,
      {dlg_title: '修改Api', doc: row},
      (result) => {
        // console.log(result);
        if (result) this.refreshTable();
      }
    );
  }

  dlgDemo (row: any): void {
    const dialogRef = this.openDialog(
      ExternalPageDlg,
      {dlg_title: '查询护士', doc: row},
      (result) => {
        // console.log(result);
        // result非空，用户点击了对话框的确定按钮
        // result是空，则说明用户点击了对话框的取消按钮
        // 这里可以根据result返回值是否为空，来决定是否需要刷新列表。
        // this.refreshTable();
      }
    );
  }

  doTest (row: any): void {
    // console.log('row=', row);
    const navParam = {
      _id: row._id,
      url: row.url,
      reqType: row.reqType,
    };
    if (row.reqParam && row.reqParam.length > 2) {
      navParam['reqParam'] = JSON.stringify(row.reqParam);
    }
    // console.log(row.reqParam, JSON.stringify(navParam, null, 2));
    this.router.navigate(['/pages/dev/apiwebtester', navParam]);
    // console.log('jump over.');
  }

  removeApi (row: any): void {
    layerHelper.confirm('您确信要删除这条记录吗?', '删除确认',
      (index) => {
        this.http.delete('/api/apimgr/delete/' + row._id).subscribe(
          result => {
            layer.msg('删除成功');
            this.refreshTable();
          },
          err => {
            console.log('error=' + err);
            layer.msg(err);
          }
        );
      });
  }
}
