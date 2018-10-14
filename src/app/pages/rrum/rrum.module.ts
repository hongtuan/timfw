import { NgModule } from '@angular/core';
import { TreeModule } from 'ng2-tree';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ThemeModule } from '../../@theme/theme.module';

import { MaterialRefModule } from '../../@theme/material.ref.module';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ResRoleUserRoutingModule, routedComponents, entryComponents } from './rrum-routing.module';

import { AdminService} from '../../services/admin.service';

@NgModule({
  imports: [
    TreeModule,
    ThemeModule,
    FlexLayoutModule,
    MaterialRefModule,
    ResRoleUserRoutingModule,
    Ng2SmartTableModule,
    AngularDualListBoxModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  entryComponents: [
    ...entryComponents,
  ],
  providers: [
    AdminService,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class ResRoleUserModule { }
