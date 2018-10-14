import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { NbEmailPassAuthProvider, NbAuthModule } from '@nebular/auth';
import { NB_AUTH_TOKEN_CLASS, NbAuthJWTToken, NbTokenStorage } from '@nebular/auth';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ThemeModule } from './@theme/theme.module';
import { NbTokenCustomStorage } from './@theme/components/auth';

import { RequestInterceptor } from './@core/http/request.interceptor';
import { ResponseInterceptor } from './@core/http/response.interceptor';

import { CommonHttpService, MenuDataService } from './services';

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

const APP_PROVIDERS = [
  NbTokenCustomStorage,
  CommonHttpService,
  MenuDataService
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    Ng2SmartTableModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbAuthModule.forRoot({
      providers: {
        email: {
          service: NbEmailPassAuthProvider,
          config: {
            baseEndpoint: '/api',
            login: {
              endpoint: '/users/login',
              method: 'post',
            },
            register: {
              endpoint: '/auth/sign-up',
              method: 'post',
            },
            logout: {
              endpoint: '/users/logout',
              method: 'post',
            },
            requestPass: {
              endpoint: '/auth/request-pass',
              method: 'post',
            },
            resetPass: {
              endpoint: '/auth/reset-pass',
              method: 'post',
            },
            token: {
              key: 'token',
            },
          },
        },
      },
      forms: {
        login: {
          // delay before redirect after a successful login, while success message is shown to the user
          redirectDelay: 0,
          provider: 'email',  // provider id key. If you have multiple providers,
          // or what to use your own you need to tell a component to use it here
          rememberMe: false,   // whether to show or not the `rememberMe` checkbox
          showMessages: {     // show/not show success/error messages
            success: true,
            error: true,
          },
        },
        register: formSetting,
        requestPassword: formSetting,
        resetPassword: formSetting,
        logout: {
          redirectDelay: 0,
        },
        validation: {  // fields validation rules. The validations are shared between all forms.
          password: {
            required: true,
            minLength: 6,
            maxLength: 24,
          },
          email: {
            required: true,
          },
          fullName: {
            required: false,
            minLength: 4,
            maxLength: 50,
          },
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: NB_AUTH_TOKEN_CLASS, useValue: NbAuthJWTToken },
    { provide: NbTokenStorage, useClass: NbTokenCustomStorage },
    APP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    // *
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    }// */
  ],
})
export class AppModule {
}
