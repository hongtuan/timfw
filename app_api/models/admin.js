const mongoose = require( 'mongoose' );
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const menuSchema = new mongoose.Schema({
  menuName: {
    type:String,
    unique: true,
    required: true
  },
  menuConfig: {},
  menuConfigHistory: [],
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
});

const resourceSchema = new mongoose.Schema({
  resName: {
    type:String,
    unique: true,
    required: true
  },
  resType: {type:String,default:'control',enum: ['form', 'control']},
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
});

const roleSchema = new mongoose.Schema({
  roleCode: {
    type:String,
    unique: true,
    required: true
  },
  roleName: {
    type:String,
    unique: true,
    required: true
  },
  roleType: {
    type:String,
    required: true
  },
  authResIds:[{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}],
  authMenuList: [{id: Number, title:String, _id:false}],
  adminList: [{type: mongoose.Schema.Types.ObjectId, ref: 'Admin'}],
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
});
/**
 * 支持邮件地址作为用户名的管理员账号
 * 需要增加手机号码绑定，以便于用手机验证码登陆
 * 需要增加使用用户名登陆的字段，方便用户使用
 * 需要支持基于邮件的密码找回功能
 * 需要支持基于短信验证码的登陆密码重置功能。
 * @type {mongoose.Schema}
 */
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  roles:[{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}],
  hospital:[{type: mongoose.Schema.Types.ObjectId, ref: 'Hospital'}],
  status:{type:String,default:'valid',enum: ['valid', 'invalid']},
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  },
  expiredOn: {
    type: Date,
    default: moment().add(7, 'days')
  }
});

adminSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

adminSchema.methods.validPassword = function(password) {
  //console.log('password',password,JSON.stringify(this));
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
  return this.hash === hash;
};

adminSchema.methods.generateJwt = function() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);//

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    roles: this.roles,
    hospital: this.hospital,
    expiredOn: this.expiredOn,
    exp: parseInt(expiry.getTime() / 1000, 10),
  }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

/**
 * 管理员日志表，记录管理员的操作行为。
 * @type {mongoose.Schema}
 */
const adminLogSchema = new mongoose.Schema({
  account: String,
  name: String,
  logType: {type: String,default:'access',enum: ['login', 'logout','access','error']},
  logContent: String, // 记录操作细节。
  reqUrl: String,
  reqMethod: String,
  createdOn: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Resource', resourceSchema);
mongoose.model('Menu', menuSchema);
mongoose.model('Role', roleSchema);
mongoose.model('Admin', adminSchema);
mongoose.model('AdminLog', adminLogSchema);
