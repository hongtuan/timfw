import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent, DefaultPageComponent} from './pages.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';

export const routedComponents = [
  PagesComponent,
  DefaultPageComponent,
];

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {path: '', redirectTo: 'defpage', pathMatch: 'full'},
    {path: 'defpage', component: DefaultPageComponent},
    {path: 'miscellaneous', loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule'},
    {
      path: 'system',
      children: [
        {path: 'rrum', loadChildren: './rrum/rrum.module#ResRoleUserModule'},
      ]
    },
    {
      path: 'demo',
      children: [
        {path: 'prime', loadChildren: './primeng/primeng.module#PrimengModule'},
      ]
    },
    {
      path: 'dev',
      children: [
        {path: 'sysinfo', loadChildren: './system/system.info.module#SystemInfoModule'},
        {path: 'logviewer', loadChildren: './logviewer/logviewer.module#LogViewerModule'},
        {path: 'apiwebtester', loadChildren: './apiwebtester/apiwebtester.module#ApiWebTesterModule'},
        {path: 'apimgr', loadChildren: './apimgr/apimgr.module#ApiMgrModule'},
        // {path: 'systemlog', loadChildren: './systemlog/systemlog.module#SystemlogModule'},
        {path: 'bookmarks', loadChildren: './bookmarks/bookmarks.module#BookmarksModule'},
      ]
    }, {
      path: '**',
      component: NotFoundComponent,
    }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
