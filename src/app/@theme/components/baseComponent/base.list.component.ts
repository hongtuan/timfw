import {MatDialog} from '@angular/material';
import {ChangeDetectorRef, Component} from '@angular/core';
import {ServerDataSource} from 'ng2-smart-table';
import {BaseComponent} from './base.component';
import {ColumnFilterComponent} from '../commDialog/column.filter.component';
import * as _ from 'lodash';

@Component({template: `<ng-content></ng-content>`})
export class BaseListComponent extends BaseComponent {
  constructor(protected dialog: MatDialog, protected cdr: ChangeDetectorRef) {
    super(dialog);
  }
  settings: any = {
    selectMode: 'single',
    columns: {},
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 10,
      perPageSelect: [10, 20, 50]
    },
  };
  _columns: any[];
  fixedColumns: string = '_rid,name';
  // source: ServerDataSourceExt;
  source: ServerDataSource;

  initColumns(): void {
    this._columns = [];
    _.each(this.settings.columns, (value, key) => {
      if (!value['hidden']) {
        value['show'] = true;
      }
      this._columns.push({key: key, value: value});
    });
  }

  setColumns(): void {
    const columns: any = {};
    // 筛选出需要显示的列
    // console.log('this._columns=', this._columns);
    _.each(this._columns, (item) => {
      if (item.value.show) {
        item.value.hidden = false;
        columns[item.key] = item.value;
        // this._selectedColumns.push(item.key);
      }else {
        item.value.hidden = true;
      }
    });
    // console.log('columns', columns);
    this.settings.columns = columns;
    // 通过克隆替换，来触发底层的更新感知操作。
    this.settings = _.clone(this.settings);
  }

  setShowColumns(): void {
    const tmpColumns = _.filter(this._columns,
      (o) => !_.includes(this.fixedColumns, o.key));
    const dialogRef = this.openDialog(
      ColumnFilterComponent,
      {dlg_title: '选择显示列', doc: tmpColumns},
      (result) => {
        // console.log(result);
        // result非空，用户点击了对话框的确定按钮
        // result是空，则说明用户点击了对话框的取消按钮
        // 这里可以根据result返回值是否为空，来决定是否需要刷新列表。
        // this.refreshTable();
        // console.log('result', result);
        if (result) {
          _.unionBy(this._columns, result, 'key');
          this.setColumns();
          this.cdr.detectChanges();
        }
      }
    );
  }
}
