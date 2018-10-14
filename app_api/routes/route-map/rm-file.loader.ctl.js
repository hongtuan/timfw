const controller = require('../../controllers/web/file.loader');
module.exports.routeConfig = {
  '/fl/':[
    {'':{get: controller.loadFile}},
  ]
};

//router.get('/fl', fileLoader.loadFile);
