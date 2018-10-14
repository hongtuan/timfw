import {Routes, RouterModule} from '@angular/router';
import {BookmarksComponent} from './bookmarks.component';
import {BookmarksDialogForm, ItemDialogForm, NavInfoComponent} from './components';

export const entryComponents = [
  BookmarksDialogForm,
  ItemDialogForm,
  NavInfoComponent
];

export const routedComponents = [
  BookmarksComponent,
  ...entryComponents
];
const routes: Routes = [
  {
    path: '',
    component: BookmarksComponent
  }
];

export const routing = RouterModule.forChild(routes);
