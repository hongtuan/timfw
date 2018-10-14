import { Injectable }                             from '@angular/core';
// import { Headers, Http,RequestOptions,Response }  from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SystemInfoService {

  private jsonRequestOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {}

 
  private apiUrl = '/api/sysinfo';  // URL to web api



  getSystemInfo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      // .map(this.extractData).catch(this.handleError);
  }

}
