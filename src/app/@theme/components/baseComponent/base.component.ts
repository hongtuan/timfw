import { Component } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import * as _ from 'lodash';

const DialogConfig = {
  disableClose: true,
  hasBackdrop: true,
  width: 'auto',
  minWidth: '320px',
  maxWidth: '800px',
  height: 'auto',
  minHeight: '240px',
  maxHeight: '600px',
};

@Component({template: `<ng-content></ng-content>`})
export class BaseComponent {
  protected parserError(error: any): any {
    // console.log('error:', JSON.stringify(error, null, 2));
    const errCode = error.status;
    // console.log('errCode=', errCode);
    const errInfo = {message: '未知错误'};
    switch (errCode) {
      case 400:
        const invalidInput = error.error.invalidInput;
        const tmpA = [];
        _.each(invalidInput, function (item) {
          tmpA.push(item.msg);
        });
        errInfo.message = tmpA.join(',');
        break;
      case 500:
        errInfo.message = error.error.message ? error.error.message : error.error.errmsg;
        break;
      default:
    }
    return errInfo;
  }

  constructor(protected dialog: MatDialog) {
  }
  /**
   * 打开对话框的方法
   * @param dialogComponent 对话框组件类
   * @param {string | any} titleOrData 注入到对话中的数据，标题(新增)或者数据模型(更新)
   * @param {Function}afterCloseCallback 对话框关闭时的回调方法
   * @param {Function}afterOpenCallback 对话框打开时的回调方法
   * @param _dialogConfig 对话框配置参数，可覆盖默认对话默认配置
   * @returns {MatDialogRef<any>}
   */
  protected openDialog(
    dialogComponent: any,
    titleOrData: string | any,
    afterCloseCallback?,
    afterOpenCallback?,
    _dialogConfig?: any): MatDialogRef<any> {
    const dialogConfig = _.clone(DialogConfig);
    if (typeof titleOrData === 'string') {
      dialogConfig['data'] = {dlg_title: titleOrData};
    }else {
      _.assign(dialogConfig, {data: titleOrData });
    }
    if (_dialogConfig) {
      _.assign(dialogConfig, _dialogConfig);
    }
    // console.log(dialogConfig);
    // open dialog here:
    const dialogRef: MatDialogRef<any> = this.dialog.open(dialogComponent, dialogConfig);
    if (afterCloseCallback) {
      dialogRef.afterClosed().subscribe(result => {
        // console.log(`Dialog result: ${JSON.stringify(result)}`);
        afterCloseCallback(result);
      });
    }
    if (afterOpenCallback) {
      dialogRef.afterOpen().subscribe(() => {
        // console.log(`Dialog result: ${JSON.stringify(result)}`);
        afterOpenCallback();
      });
    }
    return dialogRef;
  }
}

