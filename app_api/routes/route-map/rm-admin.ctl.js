const controller = require('../../controllers/web/admin.ctl');
module.exports.routeConfig = {
  '/menu/': [
    {'create': {post: controller.createMenu}},
    {'save': {post: controller.saveMenu}},
    {'load/:menuName': {get: ['webFilter', controller.loadMenu]}},
    {'update': {get: controller.updateMenu}},
  ],
  '/role/': [
    {'list': {get: ['webFilter', controller.loadRoles]}},
    {'create': {post: controller.createRole}},
    {'update': {post: controller.updateRole}},
    {'delete/:roleId': {delete: controller.deleteRole}},
    {'update-menu': {put: controller.updateRoleMenu}},
  ],
  '/user/': [
    {'list': {get: ['webFilter', controller.loadUsers]}},
    {'create': {post: controller.createUser}},
    {'update/:id': {put: controller.updateById}},
    {'update-status': {put: controller.updateUserStatus}},
    {'update-pwd': {put: controller.updateUserPassword}},
    {'update': {put: controller.updateUser}},
    {'update-hospital': {put: controller.updateUserHospital}},
    {'delete/:adminId': {delete: controller.deleteUser}},
  ]
};
