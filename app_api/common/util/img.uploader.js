const multer = require('multer');
const fs = require('fs');
const path = require('path');
const fileUtil = require('file.utils');
const moment = require('moment');
// 上传文件存储的路径.
const uploadPath = 'client/assets/uploads/';
// 主动检测建立上传目录
fileUtil.mkDirsSync(uploadPath);

const storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹会自动创建。
  destination: function (req, file, cb) {
    // console.log(JSON.stringify(file));
    //if (mkdirsSync(uploadPath)) {
    cb(null, uploadPath);
    //}
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    const fileFormat = (file.originalname).split('.');
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
  }
});
//添加配置文件到muler对象。
const upload = multer({
  storage: storage
});

//导出对象
module.exports = upload;
