const adminDao = require('../../dao/admin.dao');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const logger = require("../../config/logger.lib");
const controllerHelper = require("../controllerHelper");
const util = require('../../../utils/util');
module.exports.userLogin = function(req, res) {
  req.checkBody('email', 'email为必填项').exists();
  req.checkBody('email', 'email长度最小为6').trim().isLength({ min: 6 });
  req.checkBody('password', 'password长度最小为6').trim().isLength({ min: 6 });
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const account = req.body.email;
  const password = req.body.password;
  adminDao.adminLogin(account, password, (err, userInfo) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err).end();
    }
    if (userInfo.loginResult !== 0) {
      return res.status(401).json(userInfo).end();
    }
    // const token = adminDao.generateUserJwt(userInfo, 86400*3);
    const token = adminDao.generateToken(userInfo, '3d'); // 测试可以设置2m=2分钟.
    // const token = adminDao.generateUserJwt(userInfo, 86400*2);
    res.status(200).json({token: token});
  });
};

module.exports.userLogout = function(req, res) {
  res.status(200).json({"token" : null});
};

module.exports.checkRealName = function(req, res) {
  req.checkQuery('name', '姓名为必填项').exists();
  req.checkQuery('name', 'name长度最小为2').trim().isLength({ min: 2 });

  req.checkQuery('idcard', '身份证号为必填项').exists();
  req.checkQuery('idcard', '身份证长度最小为18').trim().isLength({ min: 18 });

  req.checkQuery('mobile', '手机号为必填项').exists();
  req.checkQuery('mobile', '手机号长度最小为11').trim().isLength({ min: 11 });
  if (req.validationErrors()) {
    controllerHelper.outValidationErrors(req,res);
    return;
  }
  const checkInfo = {
    name: req.query.name,
    idcard: req.query.idcard,
    mobile: req.query.mobile
  };
  util.checkRealName(checkInfo, function (err, result) {
    if(err){
      res.status(201).json(err);
      return;
    }
    res.status(200).json(result);
  });
};
