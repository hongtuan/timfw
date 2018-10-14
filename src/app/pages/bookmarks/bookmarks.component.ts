import {Component, OnInit, ElementRef, DoCheck} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BookmarksDialogForm} from './components/bookmarks.dialog.form';
import {ItemDialogForm} from './components/item.dialog.form';
import {Http} from '@angular/http';
import {BookmarkService} from '../../services/bookmark.service';
import {BaseComponent} from '../../@theme/components';
import {DndListEvent} from '@fjsc/ng2-dnd-list';
import * as _ from 'lodash';

@Component({
  selector: 'bookmarks-list',
  templateUrl: './bookmarks.component.html',
  styleUrls: [
    './bookmarks.component.css',
  ]
})
export class BookmarksComponent extends BaseComponent implements OnInit {
  public model = [];
  public oldmodel = [];
  bodyhidden = [];
  dataItems: any;
  targetObj = {};
  toolbar: string = '<i class="fa fa-edit"></i>';

  constructor(public http: Http, public dialog: MatDialog,
              private bookmarkService: BookmarkService,
              protected elementRef: ElementRef) {
    super(dialog);
    this.getData();
  }

  private getData() {
    this.model.length = 0;
    this.http.get('/api/bookmarks/container/list').subscribe(
      result => {
        const _data = JSON.parse(result['_body']).rows;
        this.dataItems = _data;
        // console.log(JSON.parse(result['_body']).rows);
        _data.forEach((effect: any, index: number) => {
          this.bodyhidden.push(false);
          const container = {data: effect, effectAllowed: 'all'};
          this.model.push(container);
        });
        this.oldmodel = this.model;
      },
      err => {
        console.log('error=' + err);
        layer.msg(err);
      }
    );
  }

  ngOnInit(): void {
  }

  /*  ngDoCheck() {
      if (this.model !== this.oldmodel) {
        this.oldmodel = this.model;
        const _model = this.model;
        for (let i = 0; i < this.model.length; i++) {
          _model[i].data.containerIndex = i;
          this.bookmarkService.updateBookmark(_model[i].data).subscribe(
            commerical => {
              console.log('OK', JSON.stringify(commerical))
              // layer.msg('删除成功');
              // this.getData();
            },
            error => {
              // layer.msg('操作失败' + error);
            }
          );
          // this.model = this._model;
        }
        console.log('-------------------------')
      } else {
        // console.log("没有任何改变地调用了");
      }
    }*/

  public onDragover(event: DndListEvent, items?: Array<any>) {
    // console.log('onDrop');
    // event.stopDragover();
    this.logListEvent('dragged over', event.index, event.external, event.type);

    if (event.type === 'container' && !event.external) {
      // 如果是容器，隐藏cardbody
      for (let i = 0; i < this.model.length; i++) {
        this.bodyhidden[i] = true;
      }
      // console.log('Container being dragged contains ' + event.callback() + ' items');
    }
    // 限制容器中item数量
    /* if (items && items.length > 9) {
       event.stopDragover();
     }*/
  }

  public onDrop(event: DndListEvent) {
    // ----
    if (event.type === 'container' && !event.external) {
      for (let i = 0; i < this.model.length; i++) {
        this.bodyhidden[i] = false;
      }
    }
    const that = this;
    setTimeout(function () {
      const _model = that.model;
      for (let m = 0; m < _model.length; m++) {
        _model[m].data.containerIndex = m;
        that.bookmarkService.updateBookmark(_model[m].data).subscribe(
          commerical => {
            // console.log('OK111', JSON.stringify(commerical))
          },
          error => {
            // layer.msg('操作失败' + error);
          }
        );
      }
    }, 500);
    // ----
    this.logListEvent('dropped at', event.index, event.external, event.type);
    return event.item;
  }

  public logEvent(message) {
    console.log(message);
  }

  public onInserted(event: DndListEvent) {
    // console.log('event', JSON.stringify(event));
    this.logListEvent('inserted at', event.index, event.external, event.type);
  }

  public logListEvent(action: string, index: number, external: boolean, type: string) {
    let message = external ? 'External ' : '';
    message += type + ' element was ' + action + ' position ' + index;
    // console.log(message);
  }

  change($event, containers) {
    console.log('change');
    containers = $event;
  }

  moved(index: number, list: Array<any>) {
    console.log('moved');
    list.splice(index, 1);
  }

  // 伸缩cardbody
  public showBody(index: number): void {
    this.bodyhidden[index] = !this.bodyhidden[index];
  }

  openAddDlg(): void {
    const dialogRef = this.openDialog(
      BookmarksDialogForm,
      {dlg_title: '新增容器'},
      (result) => {
        if (result) {
          const container = {data: result, effectAllowed: 'all'};
          this.model.push(container);
        }
      }
    );
  }

  openEditDlg(row: any): void {
    const dialogRef = this.openDialog(
      BookmarksDialogForm,
      {dlg_title: '修改容器', doc: row},
      (result) => {
        // this.getData();
      }
    );
  }

  deleteContainer(row: any): void {
    layerHelper.confirm('您确信要删除吗?', '删除确认',
      (index) => {
        this.http.delete('/api/bookmarks/container/delete/' + row._id).subscribe(
          result => {
            layer.msg('删除成功');
            this.model = this.model.filter(function (item) {
              return item.data._id !== JSON.parse(result['_body']).id;
            });
          },
          err => {
            console.log('error=' + err);
            layer.msg(err);
          }
        );
      });
  }

  public addItem(container: any): void {
    // console.log('container', container);
    const dialogRef = this.openDialog(
      ItemDialogForm,
      {dlg_title: '新增子项', doc: container},
      (result) => {
        // this.getData();
      }
    );
  }

  editItem(row: any, itemIndex: any): void {
    const dialogRef = this.openDialog(
      ItemDialogForm,
      {dlg_title: '修改子项', doc: row, itemIndex: itemIndex},
      (result) => {
        // this.getData();
      }
    );
  }

  deleteItem(row: any, itemIndex: any): void {
    const that = this;
    layerHelper.confirm('您确信要删除吗?', '删除确认',
      (index) => {
        row.items.splice(itemIndex, 1);
        that.bookmarkService.updateBookmark(row).subscribe(
          commerical => {
            layer.msg('删除成功');
            this.getData();
          },
          error => {
            layer.msg('操作失败' + error);
          }
        );
      });
  }

  getTarget(item: any): string {
    if (item && !this.targetObj[item._id]) {
      this.targetObj[item._id] = _.uniqueId('ex_');
    }
    return this.targetObj[item._id];
  }
}
