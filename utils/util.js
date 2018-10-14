// util.js
var superagent = require('superagent');
var moment = require('moment');
var fs = require('fs');
var Base64 = require('js-base64').Base64;
var du = require('../app_client/myjs/data_utils.js');

module.exports = {
  extend : function( target, source, flag){
    for(var key in source){
      if (source.hasOwnProperty(key)) {
        flag ? (target[key] = source[key]) : (target[key] === void 0 && (target[key] = source[key]));
      }
    }
    return target;
  },
  getTimeDistanceDesc:function(dist){
    var mSeconds = 1000;
    var  mSecondsInMinute = mSeconds * 60;
    var  mSecondsInHour = mSecondsInMinute * 60;
    var  mSecondsInDay = mSecondsInHour * 24;// 3600*24*1000

    var d = Math.floor(dist/mSecondsInDay);
    var h = Math.floor(dist % mSecondsInDay / mSecondsInHour);
    var m = Math.floor(dist % mSecondsInHour / mSecondsInMinute);
    var s = Math.floor(dist % mSecondsInMinute / mSeconds);

    var dictArray = [
      [d,d>1?'days':'day'].join(''),
      [h,h>1?'hours':'hour'].join(''),
      [m,m>1?'minutes':'minute'].join(''),
      [s,s>1?'seconds':'second'].join('')
    ];

    if (dist >= mSecondsInDay) {
      //do nothing.
    }else if (mSecondsInHour <= dist && dist < mSecondsInDay) {
      dictArray = dictArray.slice(1);
    }else if (mSecondsInMinute <= dist && dist < mSecondsInHour) {
      dictArray = dictArray.slice(2);
    }else{
      dictArray = dictArray.slice(3);
    }
    return dictArray.join(',') ;
  },
  jsonMsg:function(info){
    return {msg:info};
  }
};

module.exports.sendJsonContent = function(res, status, content, msgName) {
  //console.log('status='+status);
  //console.log('content='+content);
  //console.log('typeof content='+typeof content);
  //res.type('application/json');
  res.type('json');
  if(typeof status == 'number')
    res.status(status);
  else
    res.status(200);
  var ctType = typeof content;
  if(ctType == 'undefined'){
    content = status ;
  }
  if(ctType == 'string' || ctType == 'number'){
    if(msgName && typeof msgName == 'string'){
      var obj = {};
      obj[msgName] = content
      res.json(obj);
    }else{
      res.json({msg:content});
    }
  }else if(ctType == 'object' || content == null){
    res.json(content);
  }
  res.end();
};

module.exports.sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.getNodesData = function(url,cb){
  console.info('reading data from['+url+']...');
  superagent.get(url).end(function(err, urlContent){
    var dataList = [];
    if(err) {
      console.error(err);
      if (cb) cb(err,dataList);
      return;
    }
    //parse raw data first
    var rawDataList = [];
    if(typeof urlContent == 'object'){
      try{
        rawDataList = JSON.parse(urlContent.text);
      }catch(e){
        console.error(e);
        if (cb) cb(err,dataList);
        return;
      }
    }
    //then parse to node data.
    if(Array.isArray(rawDataList)){
      dataList = du.parserNodes(rawDataList);
    }
    //return via cb.
    if(cb) cb(null,dataList);
  });
};


module.exports.downloadFile = function(res,fc,fnPre) {
  var tmp = require('tmp');
  var tmpFileObj = tmp.fileSync();
  //console.log("File: ", tmpFileObj.name);
  //res.status(200).json(boundaryData);
  var fs = require('fs');
  //console.log(JSON.stringify(boundaryData,null,2));
  fs.appendFileSync(tmpFileObj.name,JSON.stringify(fc,null,2));
  //console.log("File content write over.");
  var fn = `${fnPre||'file'}_${moment().format('YYYYMMDDHHmm')}.json`;
  //console.log(fn);
  res.download(tmpFileObj.name, fn);
};

module.exports.downloadExcelFile = function(res,data,headerInfo,fnPre) {
  var tmp = require('tmp');
  var tmpFileObj = tmp.fileSync();
  //console.log("File: ", tmpFileObj.name);
  //res.status(200).json(boundaryData);
  //var fs = require('fs');
  //console.log(JSON.stringify(boundaryData,null,2));
  //fs.appendFileSync(tmpFileObj.name,JSON.stringify(fc,null,2));
  //console.log("File content write over.");

  var xl = require('excel4node');
  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet('Sheet A');
  //var ws2 = wb.addWorksheet('Sheet B');

  // Create a reusable style
  var headerStyle = wb.createStyle({
    font: {
      bold: true,
      color: 'blue',
      size: 12
    },
    fill: {
      type: 'pattern', // Currently only 'pattern' is implimented. Non-implimented option is 'gradient'
      patternType: 'solid', //§18.18.55 ST_PatternType (Pattern Type)
      //bgColor: '#d7e2f4', // HTML style hex value. optional. defaults to black
      fgColor: '#d7e2f4' // HTML style hex value. required.
    }
  });
  var dataStyle = wb.createStyle({
    font: {
      color: 'black',
      size: 12
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
  });

  for (var i = 0; i < headerInfo.length; i++) {
    ws.column(i+1).setWidth(headerInfo[i].width);
    ws.cell(1, i + 1).string(headerInfo[i].title).style(headerStyle);
  }

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < headerInfo.length; j++) {
      //console.log(data[i][j]);
      ws.cell(i + 2, j + 1).string(data[i][j]).style(dataStyle);
    }
  }

  wb.write(tmpFileObj.name,function (err, stats) {
    var fn = `${fnPre||'file'}_${moment().format('YYYYMMDDHHmm')}.xlsx`;
    //console.log(fn);
    res.download(tmpFileObj.name, fn);
  });
};

module.exports.loadTextContent = function(pathname,encode) {
  if(fs.existsSync(pathname)){
    var bin = fs.readFileSync(pathname);
    //do with utf8+
    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
      bin = bin.slice(3);
    }
    return bin.toString(encode||'utf-8');
  }else{
    console.log(pathname+' not exists.');
    return null;
  }
}

function loadBinaryFile(pathname){
  if(fs.existsSync(pathname)){
    var bin = fs.readFileSync(pathname);
    return bin;
  }else{
    console.log(pathname+' not exists.');
    return null;
  }
}

module.exports.loadBinaryFile = function(pathname) {
  return loadBinaryFile(pathname);
}

module.exports.loadFileToBase64 = function(pathname) {
  var fc = loadBinaryFile(pathname);
  return Base64.encode(fc);
}


/**
 * 判断当前时间是否在指定的时间区间内
 * _time:时间串，传入null表示获取系统当前时间
 * _from:json格式{y:y,m:m,d:d,h:h,m:m,s:s}定义的时间范围起点,月份0~11
 * _to:json格式{y:y,m:m,d:d,h:h,m:m,s:s}定义的时间范围终点,月份0~11
 * return true:在范围内，false:不在范围内
 */
module.exports.isInTimeRange = function(_time,_from,_to) {
  var time = _time!=null?moment(_time):moment();
  var from = moment();
  if(_from.y) from = from.set('year', _from.y);
  if(_from.M) from = from.set('month', _from.M);
  if(_from.d) from = from.set('date', _from.d);
  if(_from.h) from = from.set('hour', _from.h);
  if(_from.m) from = from.set('minute', _from.m);
  if(_from.s) from = from.set('second', _from.s);

  var to = moment();
  if(_to.y) to = to.set('year', _to.y);
  if(_to.M) to = to.set('month', _to.M);
  if(_to.d) to = to.set('date', _to.d);
  if(_to.h) to = to.set('hour', _to.h);
  if(_to.m) to = to.set('minute', _to.m);
  if(_to.s) to = to.set('second', _to.s);
  //* out for confirm
  var fmt = 'YYYY-MM-DD:hh:mm:ss';
  console.log(time.format(fmt),'isInTimeRange[',from.format(fmt),to.format(fmt),']');
  //console.log('from=',from.format(fmt));
  //console.log('  to=',to.format(fmt));//*/
  return time.isBetween(from,to);
}

module.exports.checkRealName = function(info, callback) {
  // 京东万象天眼数据服务
  superagent.get('https://way.jd.com/hangzhoushumaikeji/mobile_real_name_verify')
    .query({name: info.name})
    .query({idcard: info.idcard})
    .query({mobile: info.mobile})
    .query({appkey: 'b0a4b5b657a4330e9392ce9a6a7655d3'}) // tht
    // .query({appkey: '7bf253e49f7b9a30c19270337b6a5e87'}) //zyf
    .end(function(err, res) {
      if (err) {
        console.log('err:', err);
        callback(err, null);
        return;
      }
      // console.log(JSON.stringify(res,null,2));
      //console.log(res.statusCode,res.text);
      const checkResult = {passed: false};
      if(res.statusCode === 200){
        // let locData = JSON.parse(res.text);
        const text = JSON.parse(res.text);
        // console.log('res.text=', res.text, 'text=', text);
        if (text.code === '10000') {
          checkResult.passed = text.result.result.res === '1';
          if (!checkResult.passed) {
            checkResult.message = text.result.result.description;
          }
        }else{
          checkResult.message = text;
        }
        callback(null, checkResult);
        return;
      }
      callback(
        res,
        null
      );
    });
};

