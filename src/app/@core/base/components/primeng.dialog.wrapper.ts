import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'p-dialog-content',
  template: `<ng-content></ng-content>`
})
export class PrimeNgDialogContent {
}

@Component({
  selector: 'p-dialog-button',
  template: `<ng-content></ng-content>`
})
export class PrimeNgDialogButton {
}

@Component({
  selector: 'p-dialog-wrapper',
  template: `
    <p-dialog [header]="dialogTitle" [resizable]="true" [maximizable]="false" [baseZIndex]="10000"
              [contentStyle]="{'margin-top': '10px','overflow':'visible'}"
              [(visible)]="displayDialog" [responsive]="true" [modal]="true" [closable]="true">
      <ng-content select="p-dialog-content"></ng-content>
      <p-footer>
        <div fxLayout="row" fxLayoutAlign="end start" fxLayoutGap="10px">
          <ng-content select="p-dialog-button"></ng-content>
        </div>
      </p-footer>
    </p-dialog>
  `,
})
export class PrimengDialogWrapper implements OnInit {
  @Input() dialogTitle: string;
  @Input() displayDialog: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  /*
  openDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
  }// */
}
