import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import {NbTokenCustomStorage} from '../../../../@theme/components/auth';
import {CommonHttpService} from '../../../../services';
import {PrimeNgBaseDialog} from '../../../../@core/base/components';

@Component({
  selector: 'api-dialog-comp',
  templateUrl: './api.dialog.component.html',
})
export class ApiDialogComponent extends PrimeNgBaseDialog implements OnInit {
  reqParamStr: string;
  reqMethods: SelectItem[] = [
    {label: 'Select ReqType', value: null},
    {label: 'Get', value: 'get'},
    {label: 'Post', value: 'post'},
    {label: 'Put', value: 'put'},
    {label: 'Delete', value: 'delete'},
  ];

  constructor(private httpService: CommonHttpService,
              private authService: NbTokenCustomStorage) {
    super();
    this.defaultDoc = {
      name: 'api01',
      url: '/api/',
      reqType: 'get',
      reqParam: {key: 'value'}
    };
  }

  openDialog(data?: any, title?: string): void {
    super.openDialog(data, title, () => {
      this.reqParamStr = JSON.stringify(this.doc.reqParam, null, 2);
    });
  }

  protected onAddDocument(): void {
    const userInfo = this.authService.getUserInfo();
    this.doc.auth = userInfo.name;
    this.doc.reqParam = JSON.parse(this.reqParamStr);
    this.httpService.callPost('/api/apimgr/create', this.doc,
      (resData) => {
        layer.msg('api添加成功.');
        this.closeDialog(resData);
      },
      (error) => layer.msg('add failed.' + error)
    );
  }

  protected onModifyDocument(): void {
    // super.onModifyDocument();
    const id = this.doc._id;
    // console.log(this.reqParamStr);
    this.doc.reqParam = JSON.parse(this.reqParamStr);
    // const reqData = {doc: this.doc};
    this.httpService.callPut(`/api/apimgr/update/${id}`, this.doc,
      (resData) => {
        layer.msg('api更新成功.');
        this.closeDialog(resData);
      },
      (error) => layer.msg('update failed.' + error)
    );
  }

  cancel() {
    this.closeDialog();
  }
}
