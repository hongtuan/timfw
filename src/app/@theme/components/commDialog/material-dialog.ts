import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {BaseComponent} from '../baseComponent/base.component';

@Component({
  selector: 'material-dialog',
  templateUrl: 'material-dialog.html',
  styleUrls: ['material-dialog.css']
})
export class MaterialDialog implements OnInit {
  @Input() title: String;
  @Input() showTitle: boolean = true;
  @Input() showContent: boolean = true;
  @Input() showAction: boolean = true;
  @Input() extBodyClass: string;

  constructor() {
  }
  ngOnInit(): void {
  }
}

@Component({
  selector: 'dialog-content',
  template: `<ng-content></ng-content>`
})
export class DialogContent {
}

@Component({
  selector: 'dialog-button',
  template: `<ng-content></ng-content>`
})
export class DialogButton {
}

export const enum DialogMode { Add = 1, Edit, View }

@Component({template: `<ng-content></ng-content>`})
export class BaseDialogComponent extends BaseComponent implements AfterViewInit {

  public doc: any = {};

  protected dialogMode: DialogMode = DialogMode.Add;

  ngAfterViewInit(): void {
    // 设置对话框可拖动。
    $(this.elementRef.nativeElement).parent().draggable();
  }

  protected setData(data: any): void {
    if (data.doc) {
      this.dialogMode = DialogMode.Edit;
      this.doc = data.doc;
    }
  }

  constructor(protected dialog: MatDialog,
    protected dialogRef: MatDialogRef<BaseDialogComponent>,
    protected elementRef: ElementRef) {
    super(dialog);
  }

  protected closeDialog() {
    this.dialogRef.close(this.doc);
  }

  protected isAddDialog(): boolean {
    return this.dialogMode === DialogMode.Add;
  }

  protected isModifyDialog(): boolean {
    return this.dialogMode === DialogMode.Edit;
  }

  public onSubmit(): void {
    console.log('BaseDialogComponent onSubmit called.');
    if (this.isAddDialog()) {
      this.onAddDocument();
      return;
    }
    if (this.isModifyDialog()) {
      this.onModifyDocument();
      return;
    }
  }

  protected onAddDocument(): void {
    this.closeDialog();
  }

  protected onModifyDocument(): void {
    this.closeDialog();
  }
}
