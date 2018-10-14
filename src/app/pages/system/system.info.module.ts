import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ThemeModule} from '../../@theme/theme.module';

import {MaterialRefModule} from '../../@theme/material.ref.module';
import {BaseModule} from '../../@core/base/base.module';
import {SystemInfoService} from '../../services';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {SystemInfoRoutingModule, routedComponents, entryComponents} from './system.info.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ThemeModule,
    MaterialRefModule,
    Ng2SmartTableModule,
    SystemInfoRoutingModule,
    BaseModule,
  ],
  declarations: [
    routedComponents,
  ],
  entryComponents: [
    entryComponents,
  ],
  providers: [SystemInfoService]
})
export class SystemInfoModule {
}
