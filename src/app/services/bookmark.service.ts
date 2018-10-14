import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import {Bookmark} from '../domain/bookmark.mdl';

@Injectable()
export class BookmarkService {

  private jsonRequestOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  private apiUrl = '/api/bookmarks/container/'; // URL to web api

  addBookmark(formData: any): Observable<any> {
    const dataPkg = {
      doc: formData
    };
    return this.http.post<any>(this.apiUrl + 'create', dataPkg, this.jsonRequestOptions);
  }

  updateBookmark(formData: any): Observable<any> {
    // console.log('formData',JSON.stringify(formData));
    const dataPkg = {
      doc: formData
    };
    return this.http.put<any>(this.apiUrl + 'edit/' + formData._id,
      dataPkg, this.jsonRequestOptions);
  }

}
