import { Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { BaseDialogComponent } from '../../../@theme/components';

@Component({
  selector: 'external-page-dlg',
  template: `
    <material-dialog [title]="data.dlg_title">
      <dialog-content>
        <div fxLayout="col" fxLayoutAlign="start start">
          <div fxLayout="row" fxLayoutAlign="start start">
            <mat-form-field class="full-width">
              <input matInput placeholder="api名称" name="name" [(ngModel)]="doc.name"  tabindex="2" />
            </mat-form-field>
            <mat-form-field class="full-width">
              <input matInput placeholder="url" name="url" [(ngModel)]="doc.url"  tabindex="2" />
            </mat-form-field>
          </div>
        </div>
      </dialog-content>
      <dialog-button>
        <button mat-raised-button color="primary" tabindex="2" (click)="onSubmit()" >确定</button>
        <button mat-button mat-dialog-close tabindex="-1">取消</button>
      </dialog-button>
    </material-dialog>
  `
})
export class ExternalPageDlg extends BaseDialogComponent implements OnInit {

  constructor(protected dialog: MatDialog,
              public dialogRef: MatDialogRef<ExternalPageDlg>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    // 调用父类构造方法，必须的。
    super(dialog, dialogRef, elementRef);
    // 给文档对象赋初值。
    this.doc = {url: '', name: '', reqType: 'get'};
  }

  ngOnInit(): void {
    // 调用父类方法注入数据.
    this.setData(this.data);
  }

  onSubmit(): void {
    // 这里可以用doc来进行其他业务操作。
    layer.msg(JSON.stringify(this.doc, null, 2));
  }

}
