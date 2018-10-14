/********************************************************************
* (../controllers/web/systeminfo)路由器配置
* 映射url到控制器方法,对外提供服务
* url:{http-method:controller.method}//直接映射方法
* url:{http-method:['filter',controller.method]}//映射时配置过滤器
********************************************************************/
const systemInfo = require('../../controllers/web/systeminfo');
module.exports.routeConfig = {
  '/sysinfo/': [
    {'': {get: systemInfo.getSystemInfo}}, //...
    {'qc/:configName': {get: systemInfo.queryConfig}}, //...
    {'lc/:configName': {get: systemInfo.loadConfig}}, //...
    {'glti/:taskName': {get: systemInfo.getLongTaskInfo}}, //...
  ]
};
