const os = require('os');
const path = require('path');
const moment = require('moment');
const _ = require('lodash');
const util = require('../../../utils/util');
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const miq = require('../../../utils/miq');
function bytes2M(b){
  var m = +b/1024/1204;
  return m.toFixed(0);
}

module.exports.getSystemInfo = function(req, res) {
  var systemInfo = [];
  var cpusInfo = JSON.stringify(os.cpus());
  systemInfo.push({name:'hostname',value: os.hostname()});//操作系统主机名
  var serverUptime = Math.floor(os.uptime());
  //systemInfo.push({name:'uptime',value: serverUptime});//正常运行时间
  systemInfo.push({name:'uptime',value: util.getTimeDistanceDesc(serverUptime*1000)});//正常运行时间
  systemInfo.push({name:'serverTime',value: moment().format(dateTimeFormat)});//当前系统时间
  systemInfo.push({name:'serverTimeZone',value: process.env.TZ});//当前系统时间
  systemInfo.push({name:'appStartTime',value: moment(req.app.locals.startTime).format(dateTimeFormat)});//应用系统启动时间
  var versionInfo = util.loadTextContent(path.join(__dirname,'../../../version.info'));
  console.log('versionInfo',versionInfo);
  systemInfo.push({name:'appVersion',value:versionInfo});//应用系统版本。
  var appRunTime = Date.now() - req.app.locals.startTime;
  systemInfo.push({name:'appRunTime',value: util.getTimeDistanceDesc(appRunTime)});//应用系统启动时间
  systemInfo.push({name:'arch',value: os.arch()});//处理器架构
  systemInfo.push({name:'cpus',value: cpusInfo});//cpu信息
  systemInfo.push({name:'platform',value: os.platform()});//操作系统平台
  systemInfo.push({name:'type',value: os.type()});//操作系统名称
  systemInfo.push({name:'release',value: os.release()});//操作系统版本
  systemInfo.push({name:'totalmem',value: bytes2M(os.totalmem())+' M'});//系统总内存
  systemInfo.push({name:'freemem',value: bytes2M(os.freemem())+' M'});//空闲内存
  systemInfo.push({name:'loadavg',value: os.loadavg()});//系统最近5、10、15分钟的平均负载
  res.status(200).json(systemInfo);
};

module.exports.queryConfig = function(req, res) {
  // 从请求中获取任务名称
  const configName = req.params.configName;
  // 以配置名称作为任务名称
  const taskName = configName;
  // 从app中获取长时间任务信息.
  const longTaskInfo = req.app.locals.longTaskInfo;
  longTaskInfo[taskName] = { fc: 0, tc: 100 };
  miq.queryConfig(configName,
    (processingResult) => {
      // console.log(processingResult);
      longTaskInfo[taskName] = processingResult;
    },
    (completeResult) =>{
      // console.log(completeResult);
      longTaskInfo[taskName] = completeResult;
    }
  );
  res.status(200).json({ taskName: taskName });
};

module.exports.loadConfig = function(req, res) {
  const configName = req.params.configName;
  const packageInfo = miq.loadConfig(configName);
  // console.log(packageInfo);
  res.status(200).json(packageInfo);
};

module.exports.getLongTaskInfo = function(req, res) {
  const taskName = req.params.taskName;
  const longTaskInfo = req.app.locals.longTaskInfo;
  const taskRes = longTaskInfo[taskName];
  const result = { finished: false, data: taskRes?taskRes:{fc: 0, tc: 100} };
  if(taskRes && taskRes['finished']) {
    result.finished = true;
  }
  res.status(200).json(result);
};
