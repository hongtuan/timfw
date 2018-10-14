import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'prime-ng-dialog',
  templateUrl: './dialog.component.html',
  styles: [`
  
  `],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit {
  ngOnInit(): void {
  }
  display: boolean = false;

  showDialog() {
    this.display = true;
  }
}
