import {Injectable} from '@angular/core';
// import { Headers, Http,RequestOptions,Response }  from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LogViewerService {

  private jsonRequestOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }


  // private headers = new Headers({'Content-Type': 'application/json'});

  private apiUrl = '/api/fl';  // URL to web api


  getServerFile(fileKey: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?fn=${fileKey}`, this.jsonRequestOptions)
    // .map(this.extractData).catch(this.handleError);
  }

}
