import { Component, OnInit } from '@angular/core';
import { CarService } from './carservice';

@Component({
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {

  cars: any[];

  cols: any[];

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.carService.getCarsSmall().then(cars => this.cars = cars);

    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];
  }
}
