import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { NbTokenCustomStorage } from '../../../@theme/components/auth';
import { BaseDialogComponent } from '../../../@theme/components';
// import { HttpClient } from '@angular/common/http';
import { CommonHttpService } from '../../../services';

@Component({
  selector: 'apimgr-dialog-form',
  templateUrl: 'apimgr.dialog.form.html',
})
export class ApiConfigDialogForm extends BaseDialogComponent implements OnInit {

  constructor(protected dialog: MatDialog,
              public dialogRef: MatDialogRef<ApiConfigDialogForm>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private httpService: CommonHttpService,
              private authService: NbTokenCustomStorage) {
    super(dialog, dialogRef, elementRef);
    this.doc = {name: 'name', reqType: 'get', url: '/api/url',  reqParam: {id: '123'}};
  }

  reqParamStr: string;

  imageFile: string = './assets/img/blue-bg.jpg';
  // @ViewChild('img1') public img1;

  apiUrl: string = '/api/apimgr';

  ngOnInit(): void {
    // 调用父类方法注入数据.
    this.setData(this.data);
    this.reqParamStr = JSON.stringify(this.doc.reqParam, null, 2);
  }

  protected onAddDocument(): void {
    // console.log('ApiConfigDialogForm onAddDocument called.');
    const userInfo = this.authService.getUserInfo();
    this.doc.auth = userInfo.name;
    // console.log('this.reqParamStr=', this.reqParamStr);
    this.doc.reqParam = JSON.parse(this.reqParamStr);
    // const reqData = {doc: this.doc};
    this.httpService.callPost(`${this.apiUrl}/create`, this.doc,
      (resData) => {
        layer.msg('api添加成功.');
        this.closeDialog();
      },
      (error) => layer.msg('add failed.' + error)
    );
    /*
    this.httpClient.post<any>(`${this.apiUrl}/create`, reqData).subscribe(
      newDoc => {
        layer.msg('api添加成功.');
        this.closeDialog();
      },
      err => {
        layer.msg('add failed.' + err);
      }
    );//*/
  }

  protected onModifyDocument(): void {
    const id = this.doc._id;
    // console.log(this.reqParamStr);
    this.doc.reqParam = JSON.parse(this.reqParamStr);
    // const reqData = {doc: this.doc};
    this.httpService.callPut(`${this.apiUrl}/update/${id}`, this.doc,
      (resData) => {
        layer.msg('api更新成功.');
        this.closeDialog();
      },
      (error) => layer.msg('update failed.' + error)
    );
    /*
    this.httpClient.put<any>(`${this.apiUrl}/update/${id}`, reqData).subscribe(
      newDoc => {
        console.log('newDoc', newDoc);
        // this.doc = newDoc;
        layer.msg('api更新成功.');
        this.closeDialog();
      },
      err => {
        layer.msg('update failed.' + err);
      }
    );//*/
  }
}
