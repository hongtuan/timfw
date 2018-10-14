/********************************************************************
 * (../controllers/web/sparesgroup.ctl)路由器配置
 * 映射url到控制器方法,对外提供服务
 * url:{http-method:controller.method}//直接映射方法
 * url:{http-method:['filter',controller.method]}//映射时配置过滤器
 ********************************************************************/
const ctrlBookMarks = require('../../controllers/web/bookmarks.ctl');
module.exports.routeConfig = {
  '/bookmarks/': [
    {'container/list': {get: ctrlBookMarks.showList}}, //
    {'container/create': {post: ctrlBookMarks.create}}, //...
    {'container/edit/:id': {put: ctrlBookMarks.updateOne}}, //...
    {'container/delete/:id': {delete: ctrlBookMarks.deleteOne}}, //...
  ]
};
