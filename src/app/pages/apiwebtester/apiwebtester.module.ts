import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ThemeModule} from '../../@theme/theme.module';
import {MaterialRefModule} from '../../@theme/material.ref.module';

import {ApiWebTesterComponent} from './apiwebtester.component';
import {routing} from './apiwebtester.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ThemeModule,
    MaterialRefModule,
    routing
  ],
  declarations: [
    ApiWebTesterComponent
  ],
  providers: []
})
export class ApiWebTesterModule {}
