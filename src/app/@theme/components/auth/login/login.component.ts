/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {NB_AUTH_TOKEN_CLASS} from '@nebular/auth/auth.options';
import {getDeepFromObject} from '@nebular/auth/helpers';

import {NbAuthResult, NbAuthService} from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styles: [`
    .mylabel{
      margin-top: 7px;
      width: 60px;
      height: 36px;
    }
    .myinput{
      width: 240px;
      height: 36px;
    }
    .mybtn{
      font-size: medium;
      padding-top: 7px;
      margin-top: 7px;
      width: 80px;
      height: 36px;
    }
  `
  ]
})
export class NgxLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';
  rememberMe: boolean = false;

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_TOKEN_CLASS) protected config = {},
              protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
  }

  login(): void {
    this.errors = this.messages = [];
    // this.submitted = true;

    this.service.authenticate(this.provider, this.user).subscribe((result: NbAuthResult) => {
        // console.log('result=', result);
        // console.log('window.localStorage=', window.localStorage);

        // this.submitted = false;

        if (result.isSuccess()) {
          this.messages = result.getMessages();
          // const user = result.getTokenValue().getUser();
          // console.log('messages=', this.messages);
          // console.log('isAuthenticated =', this.service.isAuthenticated());
          // console.log('service.getToken()=', this.service.getToken());
          setTimeout(() => {
            return this.router.navigateByUrl('/pages/defpage');
          }, 100);
        } else {
          this.errors = result.getErrors();
          console.log('this.errors=', this.errors);
        }
      },
      err => {
        console.log(err);
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
