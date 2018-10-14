// JavaScript File
const express = require('express');
const router = express.Router();
const requireAll = require('require-all');
const path = require('path');
const _ = require('lodash');


// const tokenUtil = require('../common/util/apiTokenUtil');
// const patienttokenUtil = require('../../utils/patient.token.util');
const webTokenUtil = require('../common/util/apiWebTokenUtil');

const commonFilterConfig = {
  /*
  'commonFilter1': tokenUtil.verifyToken,
  'commonFilter2': tokenUtil.jhGridQueryFilter,
  'commonFilter3': tokenUtil.packQueryFilter,
  'commonFilter4': patienttokenUtil.verifyToken,//*/
  'webFilter': webTokenUtil.verifyToken,
};

const routeConfigList = requireAll({
  dirname: path.join(__dirname, './route-map/'),
  filter: /rm\-(.+)\.js$/
});
// console.log('routeConfigList=', routeConfigList);
function appendRoute(route,map){
  _.forEach(map,function(action, method){
    if(_.isFunction(action)){
      // console.log(`method=${method},route=${route},action=...`);
      router[method](route, action);
    }
    if(_.isArray(action)){
      const len = action.length;
      if(len === 1 && _.isFunction(action[0])){
        router[method](route, action);
      }else if(len > 1){
        const tmpA = _.slice(action,0,len-1);
        const handler = action[len-1];
        const filters = [];
        const authorities = [];
        _.forEach(tmpA,function (item) {
          //处理通用过滤器
          if(_.isString(item)){
            filters.push(commonFilterConfig[item]);
          }
          //处理自定义的过滤器
          if(_.isFunction(item)){
            filters.push(item);
          }
          //处理权限
          if(_.isNumber(item)){
            authorities.push(item);
          }
        });
        // TO-DO authorities 后续使用
        if(!_.isEmpty(authorities)){
          console.log(authorities);
        }
        if(!_.isEmpty(filters)){
          //console.log(`method=${method},filters=...,route=${route},action=...`);
          router[method](route, filters, handler);
        }else{
          //console.log(`method=${method},route=${route},action=...`);
          router[method](route, handler);
        }
      }
    }
  });
}

/**
 * 配置控制器
 */
(function configRoute(map,configName) {
  let routeConfig = {};
  _.forEach(map,function(value,key){
    //_.mergeWith(routeConfig,value[configName||'routeConfig']);
    _.merge(routeConfig,value[configName||'routeConfig']);
  });
  //console.log('routeConfig=', routeConfig);

  _.forEach(routeConfig, function (value, key) {
    if (_.isArray(value)){
      // 迭代数组
      _.forEach(value,function (_map) {
        //迭代数值中的map
        _.forEach(_map,function(_value,_key){
          appendRoute(key+_key,_value);
        });
      });
    } else {
      appendRoute(key,value);
    }
  });
})(routeConfigList);

module.exports = router;
