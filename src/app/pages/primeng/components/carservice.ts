import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// import { Car } from '../domain/car';

@Injectable()
export class CarService {

  constructor(private http: HttpClient) { }

  getCarsSmall() {
    return this.http.get<any>('assets/data/cars-small.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => {
        return data;
      });
  }

}
