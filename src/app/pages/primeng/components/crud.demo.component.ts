import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonHttpService } from '../../../services';
import {ApiDialogComponent} from './dialogs/api.dialog.component';
import {ApiMatDialog} from './dialogs/api.mat.dialog';
import { LazyLoadEvent } from 'primeng/api';
// import { FilterMetadata } from 'primeng/api';

@Component({
  selector: 'crud-demo-comp',
  templateUrl: './crud.demo.component.html',
})
export class CrudDemoComponent implements OnInit {
  itemList: any[];
  selectedItem: any;
  item: any;
  cols: any[];
  newItem: boolean;
  reqMethods: any[];
  totalRecords: number;
  loading: boolean;
  @ViewChild(ApiDialogComponent)
  private dialog: ApiDialogComponent;
  @ViewChild(ApiMatDialog)
  private dialogMat: ApiMatDialog;
  constructor(private httpService: CommonHttpService) {
    this.cols = [
      { field: '_rid', header: 'ID', width: '6%', noFilter: true},
      { field: 'name', header: '名称', width: '10%' },
      { field: 'reqType', header: '请求方式', width: '12%' },
      { field: 'url', header: 'url', width: '25%' },
      { field: 'testResult', header: '测试结果', width: '12%' },
      { field: 'updatedOn', header: '更新/测试时间', width: '18%', noFilter: true },
      { field: 'auth', header: '作者', width: '8%' },
      { field: 'testTimes', header: '测试次数', width: '12%', noFilter: true },
      { field: 'operate', header: '操作', width: '10%', noFilter: true, noSort: true },
    ];
    this.reqMethods = [
      {name: 'Get', code: 'get'},
      {name: 'Post', code: 'post'},
      {name: 'Put', code: 'put'},
      {name: 'Delete', code: 'delete'},
    ];
  }

  loadData(event: LazyLoadEvent) {
    this.httpService.callGet('/api/apimgr/list',
      (result) => {
        this.itemList = result.rows;
        this.totalRecords = this.itemList.length;
        console.log('call loadData over.');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {

    this.loadData(null);
  }
  showDialogToAdd() {
    // this.dialog.showDialog(null, 'AddApi');
    this.dialog.openDialog(null, 'AddApi');
  }

  showDialogToEdit(data: any, title: string) {
    // const data = {name: 'api08', reqType: 'post', url: '/api/url08', reqParam: {model: {name: 'tht'}}};
    // this.dialog.showDialogToEdit(data);
    // console.log(JSON.stringify(data, null, 2));
    this.dialog.openDialog(data, title);
  }

  showMatDialogToAdd() {
    this.dialogMat.showDialogToAdd();
  }

  onDocChanged(doc) {
    console.log('onDocChanged', JSON.stringify(doc, null, 2));
    this.loadData(null);
  }
}
