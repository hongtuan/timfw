import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialRefModule} from '../../@theme/material.ref.module';
import {ThemeModule} from '../../@theme/theme.module';
// import {BookmarksComponent} from './bookmarks.component';
// import {BookmarksDialogForm} from './components/bookmarks.dialog.form';
// import {ItemDialogForm} from './components/item.dialog.form';
// import {DragulaModule} from 'ng2-dragula';
import {DndListModule} from '@fjsc/ng2-dnd-list';
import {PrettyPrintPipe} from './pipes/pretty-print';
import {UrlFormartPipe} from './pipes/url-formart';
import {BookmarkService} from '../../services/bookmark.service';
import {routing, entryComponents, routedComponents} from './bookmarks.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    FlexLayoutModule,
    ThemeModule,
    MaterialRefModule,
    DndListModule,
    routing
  ],
  declarations: [
    PrettyPrintPipe,
    UrlFormartPipe,
    routedComponents
  ],
  entryComponents: [
    entryComponents
  ],
  providers: [BookmarkService]
})

export class BookmarksModule {
}
