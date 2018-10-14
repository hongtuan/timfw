import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import {SystemConfig} from '../const.config';
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  // readonly tokenName: string = 'auth_app_token';
  // readonly tokenName: string = SystemConfig.TOKEN_NAME;
  constructor() {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(SystemConfig.TOKEN_NAME);
    if (token) {
      const tokenFilledRequest = req.clone({
        headers: new HttpHeaders({
          'x-access-token': token,
          'content-type': 'application/json'
        })
      });
      // console.log('tokenFilledRequest=', tokenFilledRequest);
      return next.handle(tokenFilledRequest);
    }else {
      // console.log('token is null.');
      return next.handle(req);
    }
  }
}

