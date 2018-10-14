import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { NbTokenService } from '@nebular/auth';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private tokenService: NbTokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('req=', req);
    if (req.url === '/api/users/login') {
      return next.handle(req);
    }
    const started = Date.now();
    return next.handle(req).do(
      event => {
        const elapsed = Date.now() - started;
        console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        // console.log('event=', JSON.stringify(event, null, 2));
      },
      err => {
        // console.log('intercept! err:', JSON.stringify(err, null, 2));
        if (err.status === 401) {
          // console.log('intercept 401 jump to login');
          this.tokenService.clear();
          this.router.navigateByUrl('/auth/login');
          // console.log('jump over.');
        }
      }
    );
  }
}
