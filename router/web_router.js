var express       = require('express');
var router        = express.Router();
var site          = require('../controllers/site');
var sign          = require('../controllers/sign');
var item          = require('../controllers/item');
var menu          = require('../controllers/menu');
var user          = require('../controllers/user');
var auth          = require('../middlewares/auth');
var config        = require("../config/config");

router.get('/', site.index);
if(config.allow_sign_up) {
  router.post('/signup', sign.signup);
}

router.get('/config', site.config);

router.post('/login', sign.login);
router.post('/checkaccount', sign.checkAccount);                                     //获取用户图像

router.post('/resetpass', auth.adminRequired, sign.resetPass);
router.get('/active_user', sign.activeUser);
router.post('/reactive', sign.reActive);
router.get('/signout', sign.signOut);
router.post('/updatepass', auth.userRequired, sign.updatePass);

router.post('/search', site.search);
router.post('/pic/uploadpic', auth.adminRequired, site.uploadPic);                   // 上传图片
router.get('/pic/showpic', auth.adminRequired, site.showPic);                        // 获取已经上传的图片
router.post('/pic/deletepic', auth.adminRequired, site.deletePic);                   // 删除已经上传的图片

router.get('/hotitems', item.hotItems);                                              // 提供热门的菜品
router.get('/item/getguesslike', item.getGuessLike);                                 // 获取猜你喜欢

router.post('/item/create', auth.adminRequired, item.createItem);
router.get('/item/getitems', auth.userRequired, item.getItems);                      // 获取所有菜品
router.get('/item/:id/detail', auth.userRequired, item.getItem);                     // 获取菜品详情
router.post('/item/:id/delete', auth.adminRequired, item.deleteItem);                // 删除菜品
router.post('/item/delete', auth.adminRequired, item.deleteItems);                   // 批量删除菜品
router.post('/item/:id/update', auth.adminRequired, item.updateItem);                // 更新菜品详情
router.post('/item/:id/changeblock', auth.adminRequired, item.changeBlock);          // 改变锁定状态(解锁或锁定)
router.post('/item/:id/collect', auth.userRequired, item.collect);                   // 收藏菜品
router.post('/item/:id/decollect', auth.userRequired, item.decollect);               // 取消收藏菜品
router.post('/item/:id/hascollected', auth.userRequired, item.hascollected);         // 判断是方法已经收藏菜品

router.get('/hotmenus', menu.hotMenus);                                              // 提供热门的菜单
router.get('/menu/getmenus', menu.getMenus);                                         // 获取所有菜单
router.get('/menu/:id/detail', menu.getMenu);                                        // 获取菜单详情
router.post('/menu/:id/delete', menu.deleteMenu);                                    // 删除菜单详情
router.post('/menu/:id/update', menu.updateMenu);                                    // 更新菜单详情
router.post('/menu/:id/changeblock', menu.changeBlock);                              // 改变锁定状态

router.get('/user', auth.userRequired, user.getUser);                                // 获取简介信息
router.post('/user/:name/detail', auth.userRequired, user.getDetail);                // 用户详细信息
router.post('/user/:name/changeblock',auth.adminRequired, user.changeBlock);         // 锁定用户
router.post('/user/:name/update',auth.userRequired, user.update);                    // 用户更新信息

// router.post('/reply/:item_id/create', auth.userRequired, reply.create);           // 创建信息
// router.get('/reply/:item_id/getrepy', auth.userRequired, reply.getReply);         // 获取回复信息
// router.post('/reply/:item_id/changeblock',auth.adminRequired, reply.changeBlock); // 锁定回复
// router.post('/reply/:item_id/up',auth.userRequired, reply.changeBlock);           // 点赞

module.exports = router;
