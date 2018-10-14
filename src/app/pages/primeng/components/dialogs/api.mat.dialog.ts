import {Component, ElementRef, OnInit} from '@angular/core';
// import {Validators} from '@angular/forms'
@Component({
  selector: 'api-mat-dialog',
  templateUrl: './api.mat.dialog.html',
})
export class ApiMatDialog implements OnInit {
  doc: any;
  reqMethods: any[];
  displayDialog: boolean;
  reqParamStr: string;
  constructor(public elementRef: ElementRef) {

  }
  ngOnInit(): void {
    this.reqMethods = [
      {name: 'Get', code: 'get'},
      {name: 'Post', code: 'post'},
      {name: 'Put', code: 'put'},
      {name: 'Delete', code: 'delete'},
    ];
    this.doc = { reqType: 'put' };
  }
  showDialogToAdd() {
    // this.newItem = true;
    this.displayDialog = true;
  }
  save() {
    /*
    const cars = [...this.cars];
    if (this.newCar) {
      cars.push(this.car);
    } else {
      cars[this.findSelectedCarIndex()] = this.car;
    }
    this.cars = cars;
    this.car = null;//*/
    this.displayDialog = false;
  }

  cancel() {
    // const index = this.findSelectedCarIndex();
    // this.cars = this.cars.filter((val, i) => i !== index);
    // this.car = null;
    this.displayDialog = false;
  }
}
