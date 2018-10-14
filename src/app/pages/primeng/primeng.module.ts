import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ThemeModule} from '../../@theme/theme.module';
import {MaterialRefModule} from '../../@theme/material.ref.module';
import {PrimeNgRefModule} from '../../@core/primeng.ref.module';
import {ValidatorsModule} from 'ngx-validators'
import {BaseModule} from '../../@core/base/base.module';
import {CarService} from './components/carservice';
import {routing, entryComponents, routedComponents, } from './primeng.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    FlexLayoutModule,
    ThemeModule,
    MaterialRefModule,
    PrimeNgRefModule,
    BaseModule,
    routing
  ],
  declarations: [
    routedComponents
  ],
  entryComponents: [
    entryComponents,
  ],
  providers: [CarService]
})
export class PrimengModule {

}
