/********************************************************************
* (../controllers/web/api.ctl)路由器配置
* 映射url到控制器方法,对外提供服务
* url:{http-method:controller.method}//直接映射方法
* url:{http-method:['filter',controller.method]}//映射时配置过滤器
********************************************************************/
const ctrlApimgr = require('../../controllers/web/api.ctl');
module.exports.routeConfig = {
  '/apimgr/': [
    {'list': {get: ctrlApimgr.showList}},
    {'create': {post: ctrlApimgr.create}},
    {'update/:id': {put: ctrlApimgr.updateById}},
    {'itt/:id': {put: ctrlApimgr.increaseTestTimesById}},
    {'delete/:id': {delete: ctrlApimgr.deleteById}},
  ]
};
