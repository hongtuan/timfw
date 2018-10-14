import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseComponent, ButtonViewComponent,
  LabelViewComponent, DropdownMenuViewComponent} from '../../../@theme/components';
import {MatDialog} from '@angular/material';
// import {ProgressbarComponent} from './progressbar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbProgressbarExt} from '../../../@core/base/components';
import {LocalDataSource} from 'ng2-smart-table';

// const ClipboardJS: any;

import * as _ from 'lodash';

@Component({
  selector: 'ng2-table-json',
  templateUrl: 'package.info.ns.component.html',
  styles: [`
    #mysmt{
        border: 0;
    }
    .ng2-smt {
        border: 0;
        height: 200px;
        min-height: 200px;
    }
  `]
})
export class PackageInfoNsComponent extends BaseComponent implements OnInit {
  constructor(protected dialog: MatDialog,
              private http: HttpClient,
              private modalService: NgbModal) {
    super(dialog);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    _.each(this.queryResult, (value, key) => {
      this.http.get<any>(`/api/sysinfo/lc/${key}`).subscribe(
        result => {
          value.load(result.queryResult);
          this.queryInfo[key].queryTime = result.queryTime;
          this.queryInfo[key].pkgCount = result.queryResult.length;
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  queryResult: any = {
    production: new LocalDataSource(),
    development: new LocalDataSource()
  };
  queryInfo: any = {
    production: {queryTime: null, pkgCount: 0},
    development: {queryTime: null, pkgCount: 0},
  };

  showNewVer(data) {
    // console.log('showNewVersionInfo called.', data['newVersionInfo']);
    layer.open({
      type: 1,
      title: `${data.moduleName}'s newVersionInfo`,
      // skin: 'layui-layer-rim', // 加上边框
      area: ['420px', '240px'], // 宽高
      content: `<div style="padding: 3px 5px">${data.newVersionInfo.replace(/;/g, '<br />')}</div>`
    });
  }

  settings = {
    columns: {
      _rid: {
        title: 'ID',
        filter: false,
        sort: false,
        width: '20px'
      },
      moduleName: {
        title: 'Name',
        width: '120px',
        // type: 'html',
        // editable: false,
        type: 'html',
        valuePrepareFunction: (value, rowData) => {
          // console.log(cell, row);
          return `<a target="${rowData.moduleName}" href="${rowData.homepage}">${value}</a>`;
          // return `<button (click)="openEditDlg(rowData)">${value}</button>`;
        }
      },
      usingVersion: {
        title: 'usingVer',
        sort: false,
        width: '100px',
      },
      usingVersionTime: {
        title: 'usingVerTime',
        width: '160px',
      },
      usingVersionLag: {
        title: 'usingVerLag',
        width: '20px',
      },
      newVersionCount: {
        title: 'newVerCount',
        width: '20px',
        type: 'custom',
        renderComponent: LabelViewComponent,
        onComponentInitFunction: (instance) => {
          instance.setMethod('showNewVer');
          instance.setReferFieldConfig({
            field: 'newVersionCount',
            match: 'gt',
            value: '0',
            valueMap: {0: ''},
            defaultValueText: 'newVers'
          });
          instance.setValueMap({0: '无', 2: '有'});
          instance.clickEvent.subscribe(row => {
            // It's cool!
            this[row.method](row.data);
          });
        },
      },
      latestVersion: {
        title: 'latestVer',
        sort: false,
        width: '100px',
      },
      latestVersionTime: {
        title: 'latestVerTime',
        width: '160px',
      },
      // *
      button: {
        title: 'Operate',
        // width: '400px',
        type: 'custom',
        renderComponent: ButtonViewComponent,
        // renderComponent: DropdownMenuViewComponent,
        onComponentInitFunction: (instance) => {
          // console.log('onComponentInitFunction called.');
          const buttonConfig = [
            {title: '<i class="fa fa-eye"></i>', method: 'showNewVer', tip: 'showNewVersionInfo'},
            // {title: '<i class="fa fa-edit">edit</i>', method: 'fun2'},
            {title: '<i class="fa fa-copy"></i>', method: 'copyInstall', tip: 'get install'}
          ];
          // instance.setMenuTitle('<i class="fa fa-cogs">设置</i>');
          instance.setButtonConfig(buttonConfig);
          instance.clickEvent.subscribe(row => {
            // It's cool!
            // this[row['method']](row['data']);
            this[row.method](row.data);
          });
        },
        sort: false,
        filter: false
      }, // */
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 50,
      perPageSelect: [10, 20, 50, 100]
    },
    attr: {
      id: 'mysmt',
      class: 'ng2-smt'
    }
  };

  resetData(): void {
    // Set data source to first page with empty filter and empty sort.
    _.each(this.queryResult, function(item){
      item.reset();
    });
  }

  queryConfig(configName: string): void {
    // console.log('do query...');
    layer.confirm('是否查询更新包信息？', {
      title: '操作确认',
      btn: ['是', '否'] // 按钮
    }, (index) => {
      // 关闭确认对话框
      layer.close(index);
      this.http.get<any>('/api/sysinfo/qc/' + configName).subscribe(
        result => {
          // this.startRefreshTaskInfo();
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
      // get a modalRef here.
      const modalRef = this.modalService.open(
        NgbProgressbarExt, { centered: true, backdrop: 'static' });
      // get progressBar here.
      const progressBar = modalRef.componentInstance;
      progressBar.setTaskName(configName);
      progressBar.setRefreshInterval(3000);
      progressBar.startRefreshProgress();
      modalRef.result.then(finishedResult => {
        if (finishedResult) {
          // console.log('finishedResult', finishedResult);
          this.queryResult[configName].empty();
          this.queryResult[configName].load(finishedResult.queryResult);
          this.queryInfo[configName].queryTime = finishedResult.queryTime;
          this.queryInfo[configName].pkgCount = finishedResult.queryResult.length;
        }
      });
      // 打开进度条对话框
      /*
      this.openDialog(
        ProgressbarComponent,
        { taskName: configName },
        (finishedResult) => {
          if (finishedResult) {
            // console.log(result);
            this.queryResult[configName].empty();
            this.queryResult[configName].load(finishedResult.queryResult);
            this.queryInfo[configName].queryTime = finishedResult.queryTime;
            this.queryInfo[configName].pkgCount = finishedResult.queryResult.length;
          }
        },
        null,
        {width: '480px', minHeight: '40px'});//*/
    });
  }

  copyInstall(row: any) {
    // const copy = new ClipboardJS('.btn');
    new ClipboardJS('.btn', {
      text: function(trigger) {
        return `npm install --save ${row.moduleName}@${row.latestVersion}`;
      }
    });
    console.log(row);
  }
}
