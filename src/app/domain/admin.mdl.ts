const moment = require('moment');
export class Menu {
  _id: string;
  menuName: string;
  menuConfig: {};
  menuConfigHistory?: Array<{}>;
  createdOn?: Date;
  updatedOn?: Date;
  constructor(config) {
    this.menuName = config.menuName || '';
    this.menuConfig = config.menuConfig || {};
  }
}

class AssignedMenu {
  id: string;
  title: string;
}

export class Role {
  _id: string;
  roleCode: string;
  roleName: string;
  roleType: string;
  authMenuList?: Array<AssignedMenu>;
  createdOn?: Date;
  updatedOn?: Date;
  constructor(config) {
    this.roleCode = config.roleCode || '';
    this.roleName = config.roleName || '';
    this.roleType = config.roleType || '';
  }
}

export class Admin {
  _id: string;
  email: string;
  name: string;
  status: string;
  createdOn?: Date;
  updatedOn?: Date;
  expiredOn?: Date;
  hospital?: Array<{}>;
  constructor(config) {
    this.email = config.email || '';
    this.name = config.name || '';
    this.status = config.status || 'valid';
    this.expiredOn = config.expiredOn || moment().add(7, 'days');
  }
}
