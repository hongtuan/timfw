import { Component, OnInit } from '@angular/core';
// import { Car } from './domain/car';
import { CarService } from './carservice';
import { SelectItem  } from 'primeng/components/common/api';
@Component({
  selector: 'crud-table-dialog',
  templateUrl: './crud.table.dialog.component.html',
})
export class CrudTableDialogComponent implements OnInit {

  displayDialog: boolean;

  car: any = {};
  brands: SelectItem[];

  colors: SelectItem[];

  selectedCar: any;

  newCar: boolean;

  cars: any[];
  selectedColumns: any[];

  cols: any[];
  yearFilter: number;

  yearTimeout: any;

  constructor(private carService: CarService) { }

  ngOnInit() {
    this.carService.getCarsSmall().then(cars => this.cars = cars);

    this.cols = [
      { field: 'vin', header: 'Vin', width: '25%'},
      { field: 'year', header: '年份', width: '15%' },
      { field: 'brand', header: 'Brand', width: '35%' },
      { field: 'color', header: 'Color', width: '25%' }
    ];
    this.selectedColumns = [
      { field: 'vin', header: 'Vin', width: '25%'},
      { field: 'brand', header: 'Brand', width: '35%' },
      { field: 'color', header: 'Color', width: '25%' }
    ];
    this.brands = [
      { label: 'All Brands', value: null },
      { label: 'Audi', value: 'Audi' },
      { label: 'BMW', value: 'BMW' },
      { label: 'Fiat', value: 'Fiat' },
      { label: 'Honda', value: 'Honda' },
      { label: 'Jaguar', value: 'Jaguar' },
      { label: 'Mercedes', value: 'Mercedes' },
      { label: 'Renault', value: 'Renault' },
      { label: 'VW', value: 'VW' },
      { label: 'Volvo', value: 'Volvo' }
    ];

    this.colors = [
      { label: 'White', value: 'White' },
      { label: 'Green', value: 'Green' },
      { label: 'Silver', value: 'Silver' },
      { label: 'Black', value: 'Black' },
      { label: 'Red', value: 'Red' },
      { label: 'Maroon', value: 'Maroon' },
      { label: 'Brown', value: 'Brown' },
      { label: 'Orange', value: 'Orange' },
      { label: 'Blue', value: 'Blue' }
    ];

  }

  showDialogToAdd() {
    this.newCar = true;
    this.car = {};
    this.displayDialog = true;
  }

  save() {
    const cars = [...this.cars];
    if (this.newCar) {
      cars.push(this.car);
    } else {
      cars[this.findSelectedCarIndex()] = this.car;
    }
    this.cars = cars;
    this.car = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.findSelectedCarIndex();
    this.cars = this.cars.filter((val, i) => i !== index);
    this.car = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newCar = false;
    this.car = {...event.data};
    this.displayDialog = true;
  }

  findSelectedCarIndex(): number {
    return this.cars.indexOf(this.selectedCar);
  }
  onYearChange(event, dt) {
    if (this.yearTimeout) {
      clearTimeout(this.yearTimeout);
    }

    this.yearTimeout = setTimeout(() => {
      dt.filter(event.value, 'year', 'gt');
    }, 250);
  }
}
