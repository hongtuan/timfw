import { Routes, RouterModule } from '@angular/router';

import { ApiMgrComponent } from './apimgr.component';
import {ApiConfigDialogForm, ExternalPageDlg } from './components';
// import { AuthGuard }        from '../../services/auth-guard.service';

export const entryComponents = [
  ApiConfigDialogForm,
  ExternalPageDlg
];

export const routedComponents = [
  ApiMgrComponent,
  ...entryComponents,
];

const routes: Routes = [
  {
    path: '',
    //// // canActivate: [AuthGuard],
    component: ApiMgrComponent
  }
];

export const routing = RouterModule.forChild(routes);
