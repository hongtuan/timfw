const { execFile } = require('child_process');
const moment = require('moment');
const _ = require('lodash');
const async = require('async');
const os = require('os');
const fs = require('fs');
const path = require('path');
const loadJsonFile = require('load-json-file');

const pkgConfig = require('../package.json');

function showTime(_time) {
  return moment(_time).format('YYYY-MM-DD HH:mm:ss');
}
const npmName = 'npm' + (_.includes(os.platform(),'win')?'.cmd':'');
console.log('npmName=', npmName);
function getModuleInfo(mn, usingVersion,cb) {
  execFile(npmName, ['info',mn,'--json'], (error, stdout) => {
    if (error) {
      //throw error;
      console.log(error);
      if(cb) cb(error, null);
      return;
    }
    const mio = JSON.parse(stdout);
    if(cb && mio) {
      //解析查询到结果
      let time = mio.time;
      let versions = mio.versions;
      let latestVersionIndex = _.indexOf(versions, mio.version);
      let usingVersionIndex = _.indexOf(versions, usingVersion);
      let newVersions = _.slice(versions, usingVersionIndex+1, latestVersionIndex+1);
      let newVersionInfo = [];
      _.each(newVersions,function(nv){
        newVersionInfo.push(`${nv} ${showTime(time[nv])}`);
      });
      let latestVersionTime = time[mio.version];
      let usingVersionTime = time[usingVersion];
      cb(null, {
        moduleName: mio.name,
        homepage: mio.homepage?mio.homepage:'https://www.npmjs.com/package/'+mio.name,
        usingVersion: usingVersion,
        usingVersionTime: showTime(usingVersionTime),
        latestVersion: mio.version,
        latestVersionTime: showTime(latestVersionTime),
        newVersionCount: latestVersionIndex - usingVersionIndex,
        usingVersionLag: moment(latestVersionTime).diff(moment(usingVersionTime), 'days'),
        newVersions: _.isEmpty(newVersions)?'noNewVersion':newVersions.join(';'),
        newVersionInfo: _.isEmpty(newVersionInfo)?'noNewVersion':newVersionInfo.join(';'),
        createdOn: showTime(mio.time.created),
        modified: showTime(mio.time.modified),
        latestVersionPublishTime: showTime(mio.publish_time)
      });
    }
    //console.log(stdout);
  });
}

const dependencies = [];
const devDependencies = [];
_.each(pkgConfig.dependencies, function(value, key){
  dependencies.push({name: key, usingVersion: value});
});
_.each(pkgConfig.devDependencies, function(value, key){
  devDependencies.push({name: key, usingVersion: value});
});

/**
 * 查询给定的模块信息，内部采用并行方式实现。
 * @param modules
 * @param cb
 */
function queryModuleInfo(modules, cb) {
  const startTime = moment();
  const moduleInfoList = [];
  async.each(modules, function(module, callback) {
    getModuleInfo(module.name, module.usingVersion,function(err,moduleInfo){
      console.log(`${module.name} query over.`);
      if (err) {
        console.log(err);
        return;
      }
      //console.log(moduleInfo);
      moduleInfoList.push(moduleInfo);
      callback();
    });
  },function () {
    // console.log(moduleInfoList);
    console.log(`query ${modules.length} modules,use ${ moment().diff(startTime,'seconds')} seconds,get ${moduleInfoList.length} result.`);
    // console.log('Run over.');
    cb(moduleInfoList);
  });
}

function queryModuleByGroup(array, step, processingCallback, completeCallback) {
  // 先按step拆分数组
  const group = [];
  for(let i=0; i< array.length;i+=step){
    group.push(_.slice(array, i, i+step));
  }
  //console.log(group.length);
  console.log(`split ${group.length} groups to query,${step} items in a group.`);
  const startTime = moment();
  const moduleInfoList = [];
  async.forEachOfSeries(group, (modules, index, callback) => {
    queryModuleInfo(modules,function(_moduleInfoList){
      _.each(_moduleInfoList, function(item){
        moduleInfoList.push(item);
      });
      if(processingCallback) processingCallback({ fc: moduleInfoList.length, tc: array.length });
      callback();
    });
  },function (err) {
    if (err) {
      console.log(err);
    }
    console.log(`Total use ${ moment().diff(startTime,'seconds')} seconds,moduleInfoList.length= ${moduleInfoList.length}`);
    completeCallback(null, moduleInfoList);
  });
  /*
  let index = 0;
  async.until(
    function() { return index >= group.length; },
    function(callback) {
      const modules = group[index];
      console.log(`query group ${index+1}...`);
      index++;
      queryModuleInfo(modules,function(_moduleInfoList){
        _.each(_moduleInfoList, function(item){
          moduleInfoList.push(item);
        });
        // if(pcb) pcb(`${moduleInfoList.length}/${array.length}`);
        // fc: finishedCount,totalCount: tc
        if(processingCallback) processingCallback({ fc: moduleInfoList.length, tc: array.length });
        callback(null, index);
      });
    },
    function afterRun(err, n) {
      // 5 seconds have passed, n = 5
      if (err) {
        console.log(err);
      }
      console.log('n=',n);
      // console.log(moduleInfoList);
      // fs.writeFileSync(saveFile,JSON.stringify(moduleInfoList, null, 2));
      console.log(`Total use ${ moment().diff(startTime,'seconds')} seconds,moduleInfoList.length= ${moduleInfoList.length}`);
      completeCallback(null, moduleInfoList);
    }
  );//*/
}

const moduleConfig = {
  production: {data: dependencies, outFile: 'dependencies.json'},
  development: {data: devDependencies, outFile: 'devDependencies.json'},
};

module.exports.queryConfig = function(configName, processingCallback, completeCallback) {
  const module = moduleConfig[configName];
  // console.log(`query ${configName}...`);
  queryModuleByGroup(module.data, 5, processingCallback,
    (err, _moduleInfoList) => {
      if(err){
        console.log(err);
      }
      let i = 1;
      _.each(_moduleInfoList, function (item) {
        item._rid = i++;
      });
      const completeResult = {
        finished: true,
        fc: module.data.length,
        tc: module.data.length,
        queryTime: showTime(moment()),
        queryResult: _moduleInfoList
      };
      completeCallback(completeResult);
      fs.writeFileSync(path.join(__dirname, module.outFile),JSON.stringify(completeResult, null, 2));
    }
  );
};

module.exports.loadConfig = function(configName) {
  const module = moduleConfig[configName];
  const packageInfo = loadJsonFile.sync(path.join(__dirname, module.outFile));
  return packageInfo;
};
