import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { NbAuthJWTToken, NbAuthService, NbAuthResult } from '@nebular/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  tokenChangeSubscription: any;
  // authenticationChangeSubscription: any;

  @Input() position = 'normal';

  user: any = {};

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              protected router: Router,
              private authService: NbAuthService) {
    this.tokenChangeSubscription = this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token && token.getValue()) {
          this.user = token.getPayload();
          // here we receive a payload from the token and assigne it to our `user` variable
          // console.log('HeaderComponent tokenChange user=', this.user,
          //  'getTokenExpDate()', token.getTokenExpDate());
        }
      });

    /*
    this.authenticationChangeSubscription = this.authService.onAuthenticationChange()
      .subscribe( (isAuthenticated) => {
        console.log('isAuthenticated=', isAuthenticated);
        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth/login');
        }
      }); //*/
  }

  ngOnInit() {
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  showProfile() {
    // console.log('showProfile here.', this.user.name);
    // layer.msg(this.user.name);
    layer.open({
      type: 1,
      // skin: 'layui-layer-rim', // 加上边框
      area: ['420px', '240px'], // 宽高
      content: `<ba-card title="RequestData" baCardClass="with-scroll">
        {{user.name}}
      </ba-card>`
    });
  }

  logOut() {
    // console.log('logOut here.');
    this.authService.logout('email').subscribe((result: NbAuthResult) => {
      // console.log('result=', result);
      setTimeout(() => {
        return this.router.navigateByUrl('/auth/login');
      }, 100);
    });
  }

  ngOnDestroy(): void {
    this.tokenChangeSubscription.unsubscribe();
    // this.authenticationChangeSubscription.unsubscribe();
  }
}

