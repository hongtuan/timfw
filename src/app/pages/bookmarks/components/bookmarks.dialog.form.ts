import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {BookmarkService} from '../../../services/bookmark.service';
import {BaseDialogComponent} from '../../../@theme/components';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';


@Component({
  selector: 'bookmarks-dialog-form',
  templateUrl: './bookmarks.dialog.form.html',
})
export class BookmarksDialogForm extends BaseDialogComponent implements OnInit {

  constructor(protected dialog: MatDialog,
              public dialogRef: MatDialogRef<BookmarksDialogForm>,
              protected elementRef: ElementRef,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private bookmarkService: BookmarkService) {
    super(dialog, dialogRef, elementRef);
    super.setData(data);
  }

  ngOnInit(): void {
  }


  protected onAddDocument(): void {
    this.bookmarkService.addBookmark(this.doc).subscribe(
      commerical => {
        // this.bookmark = commerical;
        // this.onLocationAdded.emit(this.commerical);
        layer.msg('添加成功');
        this.closeDialog();
      },
      error => {
        layer.msg('add failed.' + error);
      }
    );
  }

  protected onModifyDocument(): void {
    this.bookmarkService.updateBookmark(this.doc).subscribe(
      commerical => {
        // this.bookmark = commerical;
        layer.msg('更新成功');
        this.closeDialog();
      },
      error => {
        layer.msg('操作失败' + error);
      }
    );
  }
}
