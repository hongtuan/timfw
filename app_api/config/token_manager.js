var jwt = require('jsonwebtoken');
var apiHttpUtil = require('../common/util/apiHttpUtil.js');

// Middleware for token verification
exports.verifyToken = function (req, res, next) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  if (token) {
    // 解码 token (验证 secret 和检查有效期（exp）)
    jwt.verify(token, apiHttpUtil.secretToken, function(err, decoded) {
      if (err) {
        return res.json(apiHttpUtil.createResultCodeDef(apiHttpUtil.tokenError));
      } else {
        // 如果验证通过，在req中写入解密结果
        req.decoded = decoded;
        //console.log(decoded)
        next(); //继续下一步路由
      }
    });
  } else {
    // 没有拿到token 返回错误
    return res.status(403).send(apiHttpUtil.createResultCodeDef(apiHttpUtil.tokenNotExistError));
  }
};
