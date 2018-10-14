import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialRefModule } from './material.ref.module';
import { FileUploadModule } from 'ng2-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  NbActionsModule,
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
} from '@nebular/theme';

import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  ThemeSettingsComponent,
  SwitcherComponent,
  LayoutDirectionSwitcherComponent,
  ThemeSwitcherComponent,
  BaCard,
  ImageFileComponent,
  MaterialDialog,
  DialogContent,
  DialogButton,
  BaseComponent,
  BaseListComponent,
  BaseDialogComponent,
  ColumnFilterComponent,
  ButtonViewComponent,
  DateTimeViewComponent,
  DateViewComponent,
  AmountViewComponent,
  TimeViewComponent,
  LabelViewComponent,
  ImageViewComponent,
  SwitchViewComponent,
  SelectViewComponent,
  DropdownMenuViewComponent,
  LabelSimpViewComponent,
} from './components';
import { CapitalizePipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';
import {
  OneColumnLayoutComponent,
  SampleLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';

const BASE_MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  FlexLayoutModule,
  FileUploadModule,
  ReactiveFormsModule,
  MaterialRefModule
];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NgbModule,
  NbSecurityModule, // *nbIsGranted directive
];


import {
  NgxAuthComponent,
  NgxAuthBlockComponent,
  NgxLoginComponent,
  NgxLogoutComponent,
  NgxRegisterComponent,
  NgxRequestPasswordComponent,
  NgxResetPasswordComponent,
} from './components/auth';

const AUTH_COMPONENT = [
  NgxAuthComponent,
  NgxAuthBlockComponent,
  NgxLoginComponent,
  NgxLogoutComponent,
  NgxRegisterComponent,
  NgxRequestPasswordComponent,
  NgxResetPasswordComponent,
];

const entryComponents = [
  BaseDialogComponent,
  ColumnFilterComponent,
  ButtonViewComponent,
  LabelViewComponent,
  ImageViewComponent,
  DateTimeViewComponent,
  DateViewComponent,
  AmountViewComponent,
  TimeViewComponent,
  SwitchViewComponent,
  SelectViewComponent,
  DropdownMenuViewComponent,
  LabelSimpViewComponent,
];

const COMPONENTS = [
  SwitcherComponent,
  LayoutDirectionSwitcherComponent,
  ThemeSwitcherComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  ThemeSettingsComponent,
  ImageFileComponent,
  OneColumnLayoutComponent,
  SampleLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  BaCard,
  MaterialDialog,
  DialogContent,
  DialogButton,
  BaseComponent,
  BaseListComponent,
  ...entryComponents,
];

const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
    },
    [ DEFAULT_THEME, COSMIC_THEME ],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES, ...AUTH_COMPONENT],
  entryComponents: [entryComponents],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}
