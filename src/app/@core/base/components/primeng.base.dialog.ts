import { Component, OnInit, Output, EventEmitter } from '@angular/core';

const enum DialogMode { Add = 1, Edit, View }

@Component({
  selector: 'primeNg-base-dialog',
  template: '<div></div>',
})
export class PrimeNgBaseDialog implements OnInit {
  private dialogMode: DialogMode = DialogMode.Add;
  dialogTitle: string;
  doc: any = {};
  defaultDoc: any;
  displayDialog: boolean;
  @Output() onDocChanged = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  protected isAddDialog(): boolean {
    return this.dialogMode === DialogMode.Add;
  }

  protected isModifyDialog(): boolean {
    return this.dialogMode === DialogMode.Edit;
  }

  openDialog(data?: any, title?: string, beforeOpenCallback?: Function) {
    // _.assign(this.doc, data ? data : this.defaultDoc);
    if (data) {
      this.doc = {...data};
      this.dialogMode = DialogMode.Edit;
    }else {
      this.doc = {...this.defaultDoc};
      this.dialogMode = DialogMode.Add;
    }

    this.dialogTitle = title ? title : 'Dialog';

    if (beforeOpenCallback) {
      beforeOpenCallback();
    }
    this.displayDialog = true;
  }

  closeDialog(newDoc?: any) {
    this.displayDialog = false;
    if (newDoc)
      this.onDocChanged.emit(newDoc);
  }

  protected onAddDocument(): void {
    this.closeDialog(null);
  }

  protected onModifyDocument(): void {
    this.closeDialog(null);
  }

  onSubmit() {
    if (this.isAddDialog()) {
      this.onAddDocument();
      return;
    }
    if (this.isModifyDialog()) {
      this.onModifyDocument();
      return;
    }
  }
}
