import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ThemeModule } from '../../@theme/theme.module';
import {MaterialRefModule} from '../../@theme/material.ref.module';
import {ApiConfigDialogForm } from './components';
import {ApiMgrService} from '../../services';
import {ApiMgrComponent} from './apimgr.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {routing, entryComponents, routedComponents } from './apimgr.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ThemeModule,
    MaterialRefModule,
    Ng2SmartTableModule,
    routing
  ],
  declarations: [
    routedComponents
  ],
  entryComponents: [
    entryComponents,
  ],
  providers: [ApiMgrService]
})
export class ApiMgrModule {
}
