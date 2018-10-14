import { Inject, Injectable } from '@angular/core';
import { NB_AUTH_TOKEN_CLASS, NbTokenStorage } from '@nebular/auth';
import {NbAuthToken, nbCreateToken, NbTokenClass} from '@nebular/auth/services/token/token';

// const Base64 = require('js-base64').Base64;
import { Base64 } from 'js-base64';
import {SystemConfig} from '../../../@core/const.config';

@Injectable()
export class NbTokenCustomStorage  implements  NbTokenStorage {
  // protected key = 'auth_app_token';
  // protected key = 'tim_frame_token';
  protected key = SystemConfig.TOKEN_NAME;

  constructor(@Inject(NB_AUTH_TOKEN_CLASS) protected tokenClass: NbTokenClass) {
  }

  /**
   * Returns token from localStorage
   * @returns {NbAuthToken}
   */
  get(): NbAuthToken {
    return nbCreateToken(this.tokenClass, localStorage.getItem(this.key));
  }

  /**
   * Sets token to localStorage
   * @param {NbAuthToken} token
   */
  set(token: NbAuthToken) {
    localStorage.setItem(this.key, token.toString());
  }

  /**
   * Sets raw (string) token to localStorage
   * @param {string} token
   */
  setRaw(token: string) {
    localStorage.setItem(this.key, token);
  }

  /**
   * Clears token from localStorage
   */
  clear() {
    localStorage.removeItem(this.key);
  }

  getTokenContent(): any {
    const _token = localStorage.getItem(this.key);
    const tokenItems = _token.split('.');
    return {
      algo: tokenItems[0] ? JSON.parse(Base64.decode(tokenItems[0])) : '',
      data: tokenItems[1] ? JSON.parse(Base64.decode(tokenItems[1])) : ''
    };
  }
  getToken(): string {
    const token = localStorage.getItem(this.key);
    // const tokenInfo = this.parseToken(token);
    // console.log(JSON.stringify(tokenInfo, null, 2));
    return token ? token : null;
  }

  getUserInfo(): any {
    const tokenContent = this.getTokenContent();
    return tokenContent.data;
  }
}
