const controller = require('../../controllers/web/user.auth.ctl');
module.exports.routeConfig = {
  '/users/': [
    {'login': {post: controller.userLogin}},
    {'logout': {post: controller.userLogout}},
    {'ckrn': {get: controller.checkRealName}},
  ]
};


//router.post('/users/register', ctrlAuth.register);
//router.put('/users/update/:uid', ctrlAuth.updateUser);
//router.get('/users/update/:uid/:state', ctrlAuth.updateUserStatus);
//router.post('/users/login', ctrlAuth.login);
//router.post('/users/logout', ctrlAuth.logout);
//router.get('/users/userlist', ctrlAuth.userList);
//router.delete('/users/:uid', ctrlAuth.deleteUser);
