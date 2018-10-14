import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {BookmarkService} from '../../../services/bookmark.service';
import {BaseDialogComponent} from '../../../@theme/components';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Component({
  selector: 'item-dialog-form',
  templateUrl: './item.dialog.form.html',
})
export class ItemDialogForm extends BaseDialogComponent implements OnInit {
  bookmark: any;
  itemIndex: number;

  constructor(protected dialog: MatDialog,
              public dialogRef: MatDialogRef<ItemDialogForm>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private bookmarkService: BookmarkService) {
    super(dialog, dialogRef, elementRef);
    this.bookmark = data.doc;
    this.itemIndex = data.itemIndex;
    // const _data = {doc: this.bookmark.items[this.itemIndex]};
    super.setData({doc: this.bookmark.items[this.itemIndex]});
  }

  ngOnInit(): void {
  }

  protected onAddDocument(): void {
    // super.onAddDocument();
    this.bookmark.items.push(this.doc);
    console.log('add this.bookmark.items', this.bookmark.items);
    this.bookmarkService.updateBookmark(this.bookmark).subscribe(
      commerical => {
        this.bookmark = commerical;
        layer.msg('添加成功');
        this.closeDialog();
      },
      error => {this.closeDialog();
        layer.msg('操作失败' + error);
      }
    );
  }

  protected onModifyDocument(): void {
    // super.onModifyDocument();
    this.bookmark.items.splice(this.itemIndex, 1, this.doc);
    console.log('this.bookmark.items', this.bookmark.items);
    this.bookmarkService.updateBookmark(this.bookmark).subscribe(
      commerical => {
        this.bookmark = commerical;
        layer.msg('更新成功');
        this.closeDialog();
      },
      error => {
        layer.msg('操作失败' + error);
      }
    );
  }
}
