import {Injectable} from '@angular/core';
// import { Headers, Http,RequestOptions,Response }  from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
// import {Api} from '../domain/Api.mdl';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiMgrService {

  private jsonRequestOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }


  private apiUrl = '/api/apilist/';  // URL/api/apimgr/ to web api

  private apimgr = '/api/apimgr/';  // URL to web api


  getModels(): Observable<any[]> {
    // 需要按用户过滤列表.
    return this.http.get<any[]>(this.apiUrl);
    // .map(this.extractData).catch(this.handleError);
  }

  addModel(formData: any, userInfo): Observable<any> {
    const dataPkg = {model: formData};
    formData.auth = userInfo.name;
    return this.http.post<any>(this.apimgr, dataPkg, this.jsonRequestOptions);
    // .map(this.extractData).catch(this.handleError);
  }

  updateModel(formData: any): Observable<any> {
    return this.http.put<any>(this.apimgr + 'edit/' + formData._id,
      formData, this.jsonRequestOptions);
    // .map(this.extractData).catch(this.handleError);
  }

  deleteModel(aid: string): Observable<any> {
    return this.http.delete<any>(this.apimgr + aid);
    // .map(this.extractData).catch(this.handleError);
  }

  callGet(url: string): Observable<any> {
    // 调用get url
    return this.http.get<any>(url);
    // .map(this.extractData).catch(this.handleError);
  }

  callPost(url: string, reqData: any): Observable<any> {
    // 调用Post url
    return this.http.post<any>(url, reqData, this.jsonRequestOptions);
    // .map(this.extractData).catch(this.handleError);
  }

  callPut(url: string, reqData: any): Observable<any> {
    // 调用Put url
    return this.http.put<any>(url, reqData, this.jsonRequestOptions);
    // .map(this.extractData).catch(this.handleError);
  }

  callDelete(url: string): Observable<any> {
    // 调用Delete url
    return this.http.delete<any>(url);
    // .map(this.extractData).catch(this.handleError);
  }

}
