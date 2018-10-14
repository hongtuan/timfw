import { Routes, RouterModule } from '@angular/router';

import { PrimengComponent } from './primeng.component';
import { DialogComponent, TableComponent, CrudTableDialogComponent, CrudDemoComponent } from './components';
import {ApiDialogComponent} from './components/dialogs/api.dialog.component';

import {ApiMatDialog} from './components/dialogs/api.mat.dialog';


export const entryComponents = [
  ApiDialogComponent,
  ApiMatDialog,
];

export const routedComponents = [
  PrimengComponent,
  DialogComponent,
  TableComponent,
  CrudTableDialogComponent,
  CrudDemoComponent,
  ...entryComponents,
];


const routes: Routes = [
  {
    path: '',
    component: PrimengComponent,
    children: [
      {
        path: 'table',
        component: TableComponent
      },
      {
        path: 'dialog',
        component: DialogComponent
      },
      {
        path: 'crud',
        component: CrudTableDialogComponent
      },
      {
        path: 'crudDemo',
        component: CrudDemoComponent
      },
    ]
  }

];
export const routing = RouterModule.forChild(routes);
