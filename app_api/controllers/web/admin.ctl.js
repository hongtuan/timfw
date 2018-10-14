const adminDao = require('../../dao/admin.dao');
const { check, body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const logger = require("../../config/logger.lib");
const controllerHelper = require("../controllerHelper");
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
module.exports.createMenu = function(req, res) {
  //req.checkBody('menuName', 'menuName不能为空！').exists();
  console.log('createMenu...',req.body);
  //*
  req.checkBody('menuName', 'menuName长度至少4位').trim().isLength({ min: 4 });
  //req.checkBody('menuConfig', 'menuConfig is required').trim().isLength({ min: 1 });
  req.sanitizeBody('menuName').trim();
  //req.sanitizeBody('menuConfig').trim();//*/
  const menuName = req.body.menuName;
  const menuConfig = req.body.menuConfig;
  //输出确认：
  console.log(`menuName=${menuName},menuConfig=${menuConfig}.`);
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  /*/开始进行数据存储
  menuDao.createMenu(menuName, menuConfig, function (err, menu) {
    if(err){
      logger.database().error(err);
      return res.status(500).json(err).end();
    }
    res.status(201).json(menu);
  });//*/
  res.status(201).json({menuName:menuName,menuConfig:menuConfig});
};

module.exports.saveMenu = function(req, res) {
  req.checkBody('menuName', 'menuName长度至少4位').trim().isLength({ min: 4 });
  //req.checkBody('menuConfig', 'menuConfig is required').trim().isLength({ min: 1 });
  req.sanitizeBody('menuName').trim();
  //req.sanitizeBody('menuConfig').trim();//*/
  const menuName = req.body.menuName;
  const menuConfig = req.body.menuConfig;
  //输出确认：
  console.log(`menuName=${menuName},menuConfig=${menuConfig}.`);
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  //开始进行数据存储
  const menuData = {menuName: menuName, menuConfig: menuConfig};
  adminDao.createOrUpdateMenu(menuData, function (err, menu) {
    if(err){
      logger.database().error(err);
      return res.status(500).json(err).end();
    }
    res.status(201).json(menu);
  });// */
};

module.exports.createMenuA = [
  body('menuName', 'menuName name required').trim().isLength({ min: 1 }),
  body('menuConfig', 'menuConfig name required').trim().isLength({ min: 4 }),
  // Sanitize (trim and escape) the name field.
  sanitizeBody('menuName').trim().escape(),
  sanitizeBody('menuConfig').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      //res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      //res.status(200).json({errors:errors.array()});
      console.log(JSON.stringify(errors.array()));
      return res.status(400).end();
    }
    else {
      let menuName = req.body.menuName;
      let menuConfig = req.body.menuConfig;
      res.status(201).json({menuName:menuName,menuConfig:menuConfig});
    }
  }
];

module.exports.loadMenu = function(req, res) {
  //const menuName = req.query.menuName;
  const menuName = req.params.menuName;
  console.log('menuName', menuName);
  adminDao.queryMenu(menuName,function (err, menuConfig) {
    if(err) {
      console.log(err);
      res.status(500).json(err);
      return;
    }
    res.status(200).json(menuConfig?menuConfig: {
        "pid": -1,
        "id": 0,
        "th": 0,
        "value": "MenuRoot",
        "link": "/pages",
        "settings": {
          "isCollapsedOnInit": false,
          "leftMenu": false,
          "rightMenu": false
        },
        "children" : [
          {
            "link" : "/pages/dev",
            // "title" : "研发管理",
            "icon" : "ion-edit",
            "pid" : 0,
            "th" : 1,
            "id" : 1,
            "value" : "研发管理",
            "children" : []
          },
        ]
      }
    );
  });
};

module.exports.loadRoles = function(req, res) {
  let cols = req.query.cols;
  if(cols) { // 约定cols用,分隔，避免转码。
    const tmpA = cols.split(',');
    cols = tmpA.join(' ');
  }
  adminDao.getRoleList(null, function (err, roles) {
    if(err) {
      console.log(err);
      res.status(500).json(err);
      return;
    }
    res.status(200).json(roles);
  },cols);
};

module.exports.createRole = function(req, res) {
  req.checkBody('roleCode', '角色编码长度至少4位').trim().isLength({ min: 4 });
  req.checkBody('roleName', '角色名长度至少4位').trim().isLength({ min: 4 });
  req.checkBody('roleType', '角色类型长度至少3位').trim().isLength({ min: 3 });
  req.sanitizeBody('roleCode').trim();
  req.sanitizeBody('roleName').trim();
  req.sanitizeBody('roleType').trim();
  const roleData = {
    roleCode: req.body.roleCode,
    roleName: req.body.roleName,
    roleType: req.body.roleType,
  };
  // const roleName = req.body.roleName;
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  adminDao.createRole(roleData, function (err, role) {
    if(err) {
      console.log(err);
      return res.status(500).json(err).end();
    }
    res.status(200).json(role);
  });
};

module.exports.updateRole = function(req, res) {
  req.checkBody('_id', 'roleId不能为空').exists();
  req.checkBody('roleCode', '角色编码长度至少4位').trim().isLength({ min: 4 });
  req.checkBody('roleName', '角色名长度至少4位').trim().isLength({ min: 4 });
  req.checkBody('roleType', '角色类型长度至少3位').trim().isLength({ min: 3 });
  req.sanitizeBody('roleCode').trim();
  req.sanitizeBody('roleName').trim();
  req.sanitizeBody('roleType').trim();

  const roleId = req.body._id;
  // const roleName = req.body.roleName;
  const roleData = {
    roleCode: req.body.roleCode,
    roleName: req.body.roleName,
    roleType: req.body.roleType,
  };
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  adminDao.updateRole(roleId, roleData, function (err, role) {
    if(err) {
      console.log(err);
      res.status(500).json(err);
      return;
    }
    res.status(200).json(role);
  });
};

module.exports.deleteRole = function(req, res) {
  req.checkParams('roleId', 'roleId不能为空').exists();
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const roleId = req.params.roleId;
  adminDao.deleteRole(roleId,function (err,deleteOk) {
    if(deleteOk){
      res.status(200).json({_id:roleId});
    }
  })
};

module.exports.updateRoleMenu = function(req, res) {
  req.checkBody('roleId', 'roleId不能为空').exists();
  //req.checkBody('authMenuList', 'roleNameauthMenuList长度至少4位').trim().isLength({ min: 4 });
  req.sanitizeBody('roleId').trim();

  const roleId = req.body.roleId;
  const authMenuList = req.body.authMenuList;
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  adminDao.authMenu2RoleById(roleId, authMenuList, function (err, role) {
    if(err) {
      console.log(err);
      res.status(500).json({message:'authMenu2RoleById error.'});
      return;
    }
    res.status(200).json(role);
  });
};

module.exports.loadUsers = function(req, res) {
  /*
  adminDao.getAdminList(null, function (err, users) {
    if(err) {
      console.log(err);
      res.status(500).json({message:'loadUsers error.'});
      return;
    }
    res.status(200).json(users);
  });//*/
  controllerHelper.getDocuments(req, res, Admin, {
    select: 'email name status roles hospital expiredOn createdOn updatedOn',
    sort: '-updatedOn -createdOn'
  });
};

module.exports.createUser = function(req, res) {
  req.checkBody('email', 'email长度至少8位').trim().isLength({ min: 8 });
  req.checkBody('name', 'name长度至少2位').trim().isLength({ min: 2 });
  req.checkBody('password', 'password长度至少6位').trim().isLength({ min: 6 });
  req.sanitizeBody('email').trim();
  req.sanitizeBody('name').trim();
  req.sanitizeBody('password').trim();
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const adminData = {
    email: req.body.email,
    name: req.body.name,
    status: req.body.status,
    expiredOn: req.body.expiredOn,
    password: req.body.password,
    roles: req.body.roles,
  };
  console.log(JSON.stringify(adminData, null, 2));
  adminDao.createAdmin(adminData, function (err, admin) {
    if(err) {
      console.log(err);
      res.status(500).json({message: err.message});
      return;
    }
    res.status(200).json(admin);
  });
};


module.exports.updateById = function(req, res) {
  req.checkParams('id', '文档id为必填项').exists();
  req.checkBody('doc', '更新文档为必填项').exists();
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const id = req.params.id;
  const updateDoc = req.body.doc;
  controllerHelper.updateDocumentById(req, res, Admin, id, updateDoc, true);
};

module.exports.updateUserStatus = function(req, res) {
  req.checkBody('adminId', 'adminId不能为空').exists();
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const adminId = req.body.adminId;
  const status = req.body.status;
  adminDao.updateAdminStatus(adminId, status, function (err, user) {
    if(err) {
      console.log(err);
      res.status(500).json({message:'updateAdminStatus error.'});
      return;
    }
    res.status(200).json(user);
  });
};


module.exports.updateUserPassword = function(req, res) {
  req.checkBody('_id', 'adminId不能为空').exists();
  req.checkBody('newPassword', 'newPassword长度至少6位').trim().isLength({ min: 6 });
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const adminId = req.body._id;
  const newPassword = req.body.newPassword;
  console.log(adminId, newPassword);
  adminDao.updateAdminPassword(adminId, newPassword, function (err, user) {
    if(err) {
      console.log(err);
      res.status(500).json({message:'updateAdminPassword error.'});
      return;
    }
    res.status(200).json(user);
  });
};


module.exports.updateUser = function(req, res) {
  // console.log(JSON.stringify(req.body, null, 2));
  req.checkBody('_id', 'adminId为必填项').exists();
  req.checkBody('name', 'name长度至少2位').trim().isLength({ min: 2 });
  // req.checkBody('password', 'password长度至少6位').trim().isLength({ min: 6 });
  req.sanitizeBody('name').trim();
  // req.sanitizeBody('password').trim();
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const adminId = req.body._id;
  const adminData = {
    name: req.body.name,
    expiredOn: req.body.expiredOn,
    roles: req.body.roles,
  };
  // console.log('adminId=', adminId, 'adminData=', JSON.stringify(adminData, null, 2));
  adminDao.updateAdmin(adminId, adminData, function (err, admin) {
    if(err) {
      console.log(err);
      res.status(500).json({message: err.message});
      return;
    }
    res.status(200).json(admin);
  });
};

module.exports.deleteUser = function(req, res) {
  req.checkParams('adminId', 'adminId不能为空').exists();
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const adminId = req.params.adminId;
  adminDao.deleteUser(adminId,function (err,deleteOk) {
    if(deleteOk){
      res.status(200).json({_id:adminId});
    }
  })
};

module.exports.updateUserHospital = function(req, res) {
  // console.log(JSON.stringify(req.body, null, 2));
  req.checkBody('_id', 'adminId为必填项').exists();
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const adminId = req.body._id;
  const hospital = req.body.hospital;
  // console.log('adminId=', adminId, 'adminData=', JSON.stringify(adminData, null, 2));
  adminDao.updateAdminHospital(adminId, hospital, function (err, admin) {
    if(err) {
      console.log(err);
      res.status(500).json({message: err.message});
      return;
    }
    res.status(200).json(admin);
  });
};
