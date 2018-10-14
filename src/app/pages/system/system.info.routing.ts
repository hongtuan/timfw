import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SystemIndexComponent} from './system.index.component';
import {
  SystemInfoComponent, PackageInfoComponent,
  ProgressbarComponent, PackageInfoNsComponent,
} from './components';


export const entryComponents = [
  ProgressbarComponent,
];

export const routedComponents = [
  SystemIndexComponent,
  SystemInfoComponent,
  PackageInfoNsComponent,
  PackageInfoComponent,
  entryComponents,
];



const routes: Routes = [
  {path: 'srv', component: SystemIndexComponent},
  {path: 'pkgns', component: PackageInfoNsComponent},
  {path: 'pkg1', component: PackageInfoComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SystemInfoRoutingModule {
}
