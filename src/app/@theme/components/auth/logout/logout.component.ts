/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NbAuthService, NbAuthResult } from '@nebular/auth/services';

@Component({
  selector: 'ngx-logout',
  template: `
    <div>Logging out, please wait...</div>
  `,
})
export class NgxLogoutComponent implements OnInit {

  redirectDelay: number = 1500;

  constructor(protected service: NbAuthService,
              protected router: Router) {
  }

  ngOnInit(): void {
    this.logout('email');
  }

  logout(provider: string): void {
    this.service.logout(provider).subscribe((result: NbAuthResult) => {

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }
}
