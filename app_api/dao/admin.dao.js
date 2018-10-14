const mongoose = require('mongoose');
const Menu = mongoose.model('Menu');
const Role = mongoose.model('Role');
const Admin = mongoose.model('Admin');
const AdminLog = mongoose.model('AdminLog');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports.pingMe = function(msg, cb) {
  console.log('msg=', msg);
  if(cb) cb(msg+'ping');
};

module.exports.createMenu = function(menuName, menuConfig, cb) {
  const menuData = {menuName: menuName, menuConfig: menuConfig, menuConfigHistory: [menuConfig]};
  Menu.create(menuData, function(err, menu) {
    if(err) {
      console.log(err);
      if(cb) cb(err, null);
      return;
    }
    if(cb) cb(null, menu);
  });
};

module.exports.updateMenu = function(menuName, menuConfig, cb) {
  Menu.findOneAndUpdate(
    { menuName: menuName },
    { menuConfig:menuConfig, updatedOn: Date.now(), $push:{menuConfigHistory: menuConfig }},
    { select:'menuName menuConfig updatedOn', new:true },
    function (err, newMenu) {
      // console.log('callback called.', newMenu);
      if(err) {
        console.log(err);
        if(cb) cb(err, null);
        return;
      }
      if (cb) cb(null, newMenu);
    }
  );
};

module.exports.createOrUpdateMenu = function(menuData, cb) {
  Menu.findOne({menuName: menuData.menuName}).select('menuName menuConfig')
    .exec(function (err, menu) {
        if (err) {
          console.log(err);
          if (cb){
            cb(err,null);
          }
          return;
        }
        console.log('menu=',menu);
        if(menu){ // 如果查到了菜单，则更新之。
          console.log('update menu here.');
          Menu.findOneAndUpdate(
            { menuName: menu.menuName },
            { menuConfig:menuData.menuConfig, updatedOn: Date.now(), $push:{menuConfigHistory: menu.menuConfig }},
            { select:'menuName menuConfig updatedOn', new:true },
            function (err, newMenu) {
              // console.log('callback called.', newMenu);
              if(err) {
                console.log(err);
                if(cb) cb(err, null);
                return;
              }
              if (cb) cb(null, newMenu);
            }
          );
        }else{ //否则创建新菜单。
          console.log('create menu here.');
          const _menuData = {menuName: menuData.menuName,
            menuConfig: menuData.menuConfig,
            menuConfigHistory: [menuData.menuConfig]};
          Menu.create(_menuData, function(err, menu) {
            if(err) {
              console.log(err);
              if(cb) cb(err, null);
              return;
            }
            if(cb) cb(null, menu);
          });
        }
      }
    );
};

module.exports.queryMenu = function(menuName, cb) {
  Menu.findOne({menuName: menuName}).select('menuConfig')
    .exec(function (err, menu) {
      if (err) {
        console.log(err);
        if (cb){
          cb(err,null);
        }
        return;
      }
      if (cb) {
        //console.log(menu.menuConfig);
        cb(null,menu?menu.menuConfig:null);
      }
    }
  );
};

module.exports.createRole = function(_roleData, cb) {
  const roleData = { authMenuList: [], authResIds: []};
  _.assign(roleData, _roleData);
  Role.create(roleData, function(err, role) {
    if(err) {
      console.log(err);
      if(cb) cb(err, null);
      return;
    }
    if(cb) cb(null, role);
  });
};

module.exports.updateRole = function(roleId, _roleData, cb) {
  const roleData = { updatedOn: Date.now() };
  _.assign(roleData, _roleData);
  Role.findOneAndUpdate(
    {_id:roleId},
    roleData,
    { select:'roleCode roleName,roleType updatedOn', new:true },
    function (err, newRole) {
      // console.log('callback called.', newRoleMenu);
      if(err) {
        console.log(err);
        if(cb) cb(err, null);
        return;
      }
      if (cb) cb(null, newRole);
    }
  );
};

module.exports.deleteRole = function(roleId, cb) {
  Role.remove({_id:roleId}).exec(function(err){
    if(err) {
      console.log(err);
      cb(err,null);
      return;
    }
    cb(null,true);
  });
};

module.exports.authMenu2RoleByName = function(roleName, authMenuList, cb) {
  if (Array.isArray(authMenuList)) {
    Role.findOne({roleName: roleName}).select('authMenuList updatedOn')
      .exec(function (err,role) {
        if(err) {
          console.log(err);
          if(cb) cb(err,null);
          return;
        }
        if (role) {
          //[...role.authMenuList, ...authMenuList];
          //console.log(role.authMenuList, authMenuList);
          let _authMenuList = _.unionBy(role.authMenuList, authMenuList, 'id');
          //let _authMenuList = _.unionWith([...role.authMenuList], authMenuList, _.isEqual);
          //console.log(_authMenuList);
          Role.findOneAndUpdate(
            { _id: role._id },
            { authMenuList: _authMenuList, updatedOn: Date.now() },
            { select:'roleName authMenuList updatedOn', new:true },
            function (err, newRole) {
              // console.log('callback called.', newRole);
              if (cb) cb(err, newRole);
            }
          );
        }else {
          if (cb) cb('role is null.', null);
        }
      });
  }else {
    Role.findOneAndUpdate(
      { roleName: roleName },
      { updatedOn: Date.now(), $push:{authMenuList: authMenuList } },
      { select:'roleName authMenuList updatedOn' },
      function (err, newRole) {
        // console.log('callback called.', newRole);
        if (cb) cb(err, newRole);
      }
    );
  }
};
module.exports.authMenu2RoleById = function(roleId, authMenuList, cb) {
  if (Array.isArray(authMenuList)) {
    Role.findOne({_id: roleId}).select('authMenuList updatedOn')
      .exec(function (err,role) {
        if(err) {
          console.log(err);
          if(cb) cb(err,null);
          return;
        }
        if (role) {
          //[...role.authMenuList, ...authMenuList];
          //console.log(role.authMenuList, authMenuList);
          let _authMenuList = _.unionBy(role.authMenuList, authMenuList, 'id');
          //let _authMenuList = _.unionWith([...role.authMenuList], authMenuList, _.isEqual);
          console.log('role.authMenuList=', role.authMenuList);
          console.log('authMenuList=', authMenuList);
          console.log('_authMenuList=', _authMenuList);
          Role.findOneAndUpdate(
            { _id: role._id },
            { authMenuList: authMenuList, updatedOn: Date.now() },
            { select:'roleName authMenuList updatedOn', new:true },
            function (err, newRole) {
              // console.log('callback called.', newRole);
              if (cb) cb(err, newRole);
            }
          );
        }else {
          if (cb) cb('role is null.', null);
        }
      });
  }else {
    Role.findOneAndUpdate(
      {_id: roleId},
      { updatedOn: Date.now(), $push:{authMenuList: authMenuList } },
      { select:'roleName authMenuList updatedOn',new:true },
      function (err, newRole) {
        // console.log('callback called.', newRole);
        if (cb) cb(err, newRole);
      }
    );
  }
};

module.exports.queryRoleAuthMenu = function(roleId, cb) {
  Role.findById(roleId).select('authMenuList').exec(function (err,role) {
    if (err) {
      console.log(err);
      if (cb) {
        cb(err,null);
        return;
      }
    }
    if (cb) {
      cb(null,role.authMenuList);
    }
  });
};

module.exports.getRoleList = function(filter,cb,cols) {
  Role.find(filter||{}).select(cols ||
    '_id roleCode roleName roleType authMenuList adminList createdOn updatedOn').sort('-updatedOn')
    .exec(function(err,rows){
      if(err) {
        cb(err,null);
        return;
      }
      cb(null,rows);
    });
};

module.exports.createAdmin = function(adminInfo, cb) {
  const admin = new Admin();
  admin.email = adminInfo.email;
  admin.name = adminInfo.name;
  admin.expiredOn = adminInfo.expiredOn;
  admin.roles = adminInfo.roles;
  admin.setPassword(adminInfo.password);
  admin.save(function(err,savedAdmin) {
    if (err) {
      // console.log(err);
      if (cb) {
        cb(err,null);
        return;
      }
    }
    if (cb) {
      cb(null,savedAdmin);
    }
  });
};

const LoginResult = {
  LoginSuccess: '登陆成功',
  AccountNotExist: '账号不存在',
  AccountDisabled: '账号已禁用',
  AccountExpired: '账号已过期',
  PasswordNotMatch: '口令不匹配'
};


/*
const loginResult = {
  accountNotExist: 'AccountNotExist', // '账号不存在',
  accountInValid: 'AccountDisabled', // '账号已禁用',
  accountExpired: 'AccountHasExpired', // '账号已过期',
  passwordNotMatch: 'PasswordNotMatch',  // '口令不正确',
  loginOk: 'LoginSuccess',  // '登陆成功'
};//*/
module.exports.adminLogin = function(account,password, cb) {
  Admin.findOne({email: account})
    .select('_id email name status salt hash roles expiredOn hospital')
    .populate('roles', 'roleCode roleName roleType authMenuList')
    .exec(function(err, admin){
    if (err) {
      if (cb) {
        cb(err,null);
        return;
      }
    }
    let loginResult = 1; //默认按账号不存在处理。
    // step0:账号是否存在
    if (admin) {
      // step1:校验口令是否匹配
      if(admin.validPassword(password)){
        // step2:校验账号是否正常
        if(admin.status === 'valid'){
          // step3 校验账号是否过期
          if(moment().isBefore(moment(admin.expiredOn))){
            // 正常登陆
            loginResult = LoginResult.LoginSuccess;
          }else{
            //
            loginResult = LoginResult.AccountExpired;
          }
        }else{
          //
          loginResult = LoginResult.AccountDisabled;
        }
      }else {
        loginResult = LoginResult.PasswordNotMatch;
      }
    }else {
      loginResult = LoginResult.AccountNotExist;
    }
    const userInfo = {loginResult: loginResult};
    if (loginResult === '登陆成功') {
      // console.log('admin.roles',admin.roles);
      _.each(admin._doc, function (value, key) {
        if (_.includes('_id email name status expiredOn hospital', key)){
          userInfo[key] = value;
        }
      });
      const assignedRoles = [];
      const assignedMenuIds = [];
      console.log('admin.roles',admin.roles);
      _.each(admin.roles, function (role) {
        assignedRoles.push({code:role.roleCode, name: role.roleName, type: role.roleType});
        _.each(role.authMenuList, function (menu) {
          if (!_.includes(assignedMenuIds, menu.id)) {
            assignedMenuIds.push(menu.id);
          }
        });
      });
      userInfo['roles'] = assignedRoles;
      userInfo['assignedMenuIds'] = assignedMenuIds;
      userInfo['loginTime'] = moment().valueOf();
      userInfo.loginResult = 0;
    }
    cb(null,userInfo);
  });
};

module.exports.generateToken = function(userData, expiresIn) {
  const option = {expiresIn: expiresIn  || '2d'};
  // DO NOT KEEP YOUR SECRET IN THE CODE!
  const token = jwt.sign(userData, process.env.JWT_SECRET, option);
  return token;
};

module.exports.updateAdminStatus = function(aid, status, cb) {
  Admin.findOneAndUpdate(
    {_id: aid},
    {status: status,updatedOn: Date.now()},
    { select:'email name  status updatedOn',new:true },
    function (err, admin) {
      if (err) {
        if (cb) {
          cb(err,null);
          return;
        }
      }
      if (cb) {
        cb(null,admin);
      }
    }
  );
};

module.exports.updateAdminPassword = function(aid, newPassword, cb) {
  // 需要先到，然后修改口令。
  Admin.findById(aid).select('email name hash salt updatedOn').exec(function(err, user){
    if(err){
      // console.log(err);
      // res.status(404).json('uid['+uid+'] not found.'+err);
      if (cb) {
        cb(err,null);
        return;
      }
    }
    // 设置新密码
    user.setPassword(newPassword);
    user.updatedOn = new Date();
    user.save(function(err, user){
      if(err){
        console.log(err);
        if (cb) {
          cb(err,null);
          return;
        }
      }
      if (cb) {
        cb(null,user);
      }
    });
  });
};

module.exports.updateAdminExpiredOn = function(aid, expiredOn, cb) {
  Admin.findOneAndUpdate(
    {_id: aid},
    {expiredOn: expiredOn,updatedOn: Date.now()},
    { select:'email name expiredOn updatedOn',new:true },
    function (err, admin) {
      if (err) {
        if (cb) {
          cb(err,null);
          return;
        }
      }
      if (cb) {
        cb(null,admin);
      }
    }
  );
};

module.exports.updateAdmin = function(aid, adminData, cb) {
  // console.log('in dao:adminId=', aid, 'adminData=', JSON.stringify(adminData, null, 2));
  const updateData = {
    name:adminData.name,
    expiredOn: adminData.expiredOn,
    updatedOn: Date.now()
  };
  if(adminData.roles){
    updateData.roles = adminData.roles;
  }
  // console.log('updateData=', JSON.stringify(updateData, null, 2));
  Admin.findOneAndUpdate(
    {_id: aid},
    updateData,
    { select:'email name roles expiredOn updatedOn',new:true },
    function (err, admin) {
      if (err) {
        // console.log(JSON.stringify(err, null, 2));
        if (cb) {
          cb(err,null);
          return;
        }
      }
      if (cb) {
        cb(null,admin);
      }
    }
  );
};

module.exports.updateAdminHospital = function(aid, hospital, cb) {
  // console.log('in dao:adminId=', aid, 'adminData=', JSON.stringify(adminData, null, 2));
  Admin.findOneAndUpdate(
    { _id: aid },
    { hospital: hospital },
    { select:'email name hospital updatedOn',new: true },
    function (err, admin) {
      if (err) {
        // console.log(JSON.stringify(err, null, 2));
        if (cb) {
          cb(err,null);
          return;
        }
      }
      if (cb) {
        cb(null,admin);
      }
    }
  );
};


module.exports.getAdminList = function(filter,cb) {
  Admin.find(filter||{}).select('email name status roles hospital expiredOn createdOn updatedOn').sort('-updatedOn -createdOn')
    .exec(function(err,rows){
      if(err) {
        cb(err,null);
        return;
      }
      cb(null,rows);
  });
};

module.exports.deleteUser = function(adminId, cb) {
  Admin.remove({_id: adminId}).exec(function(err){
    if(err) {
      console.log(err);
      cb(err,null);
      return;
    }
    cb(null,true);
  });
};

module.exports.recordAdminLog = function(logData, cb) {
  AdminLog.create(logData, function (err, adminLog) {
    if(err) {
        console.log(err);
        if (cb) cb(err,null);
      return;
    }
    if (cb) cb(null,adminLog);
  });
};

module.exports.getAdminLogList = function(option,cb) {
  AdminLog.find(option.filter||{}).select(option.column ||
    'account name logType logContent reqUrl reqMethod createdOn').sort('-createdOn')
    .limit(option.limit || 100)
    .exec(function(err,rows){
      if(err) {
        cb(err,null);
        return;
      }
      cb(null,rows);
    });
};


