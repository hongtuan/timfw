var log4js = require('log4js');
var helper = {};
exports.helper = helper;
function stackInfo() {
    var path = require('path');
    var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
    var stacklist = (new Error()).stack.split('\n').slice(3);
    var s = stacklist[0];
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    var data = {};
    if (sp && sp.length === 5) {
        data.method = sp[1];
        data.path = sp[2];
        data.line = sp[3];
        data.pos = sp[4];
        data.file = path.basename(data.path);
    }
    return data;
}
var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
var logWarn = log4js.getLogger('logWarn');
var logErr = log4js.getLogger('logErr');
helper.debug = function (msg) {
    if (msg == null)
        msg = "";
    logDebug.debug(msg);
};

helper.info = function (msg) {
    if (msg == null)
        msg = "";
    logInfo.info(msg);
};

helper.warn = function (msg) {
    if (msg == null)
        msg = "";
    logWarn.warn(msg);
};

helper.error = function (msg, exp) {
    var info = stackInfo();
    var method = info['method'] || "未检测到方法名";
    var file = info['file'];
    var line = info['line'];
    if (msg == null)
        msg = "";
    if (exp != null)
        msg += "\r\n" + exp;
    logErr.error("(" + method + ") <" + file + ":" + line + "> " + msg);
    //logErr.error(msg);
};

logInfo.info('Cheese is Gouda.');
// 配合express用的方法
exports.use = function (app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(logInfo, {
        level: 'info',
        format: ':remote-addr :method :url :status :response-time ms'
    }));
}
