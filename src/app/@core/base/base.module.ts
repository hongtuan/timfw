import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrimeNgRefModule} from '../../@core/primeng.ref.module';
import { NgbProgressbarModule, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {
  PrimeNgBaseDialog,
  NgbProgressbarExt,
  PrimengDialogWrapper,
  PrimeNgDialogContent,
  PrimeNgDialogButton
} from './components';

const BASE_COMPONENTS = [
  PrimeNgBaseDialog,
  PrimengDialogWrapper,
  PrimeNgDialogContent,
  PrimeNgDialogButton,
  NgbProgressbarExt
];
@NgModule({
  imports: [
    CommonModule,
    NgbProgressbarModule,
    PrimeNgRefModule
  ],
  declarations: BASE_COMPONENTS,
  exports: BASE_COMPONENTS,
  entryComponents: [
    NgbProgressbarExt
  ],
  providers: [NgbModal]
})
export class BaseModule {
}
