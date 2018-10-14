const fs = require('fs');
const path = require('path');
const Base64 = require('js-base64').Base64;
// 递归创建目录 同步方法
function mkDirsSync(dirName) {
  if (fs.existsSync(dirName)) {
    return true;
  } else {
    if (mkDirsSync(path.dirname(dirName))) {
      fs.mkdirSync(dirName);
      return true;
    }
  }
}

function loadBinaryFile(filePath){
  if(fs.existsSync(filePath)){
    return fs.readFileSync(filePath);
  }else{
    console.log(filePath+' not exists.');
    return null;
  }
}

module.exports.mkDirsSync = function (dirName) {
  mkDirsSync(dirName);
};

module.exports.loadTextContent = function(filePath,encode) {
  if(fs.existsSync(filePath)){
    let bin = fs.readFileSync(filePath);
    //do with utf8+
    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
      bin = bin.slice(3);
    }
    return bin.toString(encode||'utf-8');
  }else{
    console.log(filePath+' not exists.');
    return null;
  }
};

module.exports.loadBinaryFile = function(filePath) {
  return loadBinaryFile(filePath);
};

module.exports.loadFileToBase64 = function(filePath) {
  const fc = loadBinaryFile(filePath);
  return Base64.encode(fc);
};
