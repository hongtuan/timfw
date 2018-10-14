import { NgModule } from '@angular/core';

// import { PagesComponent } from './pages.component';
import { PagesRoutingModule, routedComponents } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';



@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class PagesModule {
}
