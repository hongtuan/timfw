import {Component, OnInit, OnDestroy} from '@angular/core';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';
import {MenuDataService} from '../services';
import {Router} from '@angular/router';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {

  // menu = MENU_ITEMS;
  menu = [];
  // user = {};
  $isAuthenticated: any;

  // authenticationChangeSubscription: any;
  constructor(private authService: NbAuthService,
              private router: Router,
              private menuDataService: MenuDataService) {
  }

  ngOnInit() {
    // this.menu = MENU_ITEMS;

    // *
    this.$isAuthenticated = this.authService.getToken()
      .subscribe((isAuth: NbAuthJWTToken) => {
        if (!isAuth.getValue()) {
          const link = ['/auth/login'];
          this.router.navigate(link);
        }
        if (isAuth && isAuth.getValue()) {
          // here we receive a payload from the token and assigne it to our `user` variable
          const crtUser = isAuth.getPayload();
          this.menuDataService.loadMenu(crtUser.assignedMenuIds, null).subscribe(
            (menuData) => {
              this.menu = menuData;
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }); // */
  }

  ngOnDestroy(): void {
    this.$isAuthenticated.unsubscribe();
  }
}

@Component({
  selector: 'ngx-default-page',
  template: `
    <div class="row">
      <div class="col-md-12">
        <nb-card>
          <nb-card-header>
            柒拾佳护健康管理系统
          </nb-card-header>
          <nb-card-body>
            <div>欢迎使用柒拾佳护平台。</div>
          </nb-card-body>
        </nb-card>
      </div>
    </div>
  `,
})
export class DefaultPageComponent implements OnInit {
  ngOnInit(): void {
  }
}
