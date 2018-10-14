import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuComponent, MenuItemComponent } from './res';
import { RoleListComponent, RoleComponent, MenuPreviewComponent, RoleMenuAssignComponent } from './role';
import { UserListComponent, UserComponent, UserPasswordComponent,
  UserHospitalAssignComponent } from './user';

import { ResRoleUserComponent } from './rrum.component';


const routes: Routes = [{
  path: '',
  component: ResRoleUserComponent,
  children: [
    {
      path: 'res',
      component: MenuComponent,
    },
    {
      path: 'role-list',
      component: RoleListComponent,
    },
    {
      path: 'admin-list',
      component: UserComponent,
    },
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ResRoleUserRoutingModule {

}

export const routedComponents = [
  ResRoleUserComponent,
  MenuComponent,
  MenuItemComponent,
  RoleListComponent,
  RoleComponent,
  MenuPreviewComponent,
  RoleMenuAssignComponent,
  UserListComponent,
  UserComponent,
  UserPasswordComponent,
  UserHospitalAssignComponent,
];

export const entryComponents = [
  MenuItemComponent,
  RoleComponent,
  MenuPreviewComponent,
  RoleMenuAssignComponent,
  UserComponent,
  UserPasswordComponent,
  UserHospitalAssignComponent,
];
