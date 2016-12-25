var express       = require('express');
var router        = express.Router();
var site          = require('../controllers/site');
var sign          = require('../controllers/sign');
var config        = require("../config/config");

router.get('/', site.index);
if(config.allow_sign_up) {
  router.post('/signup', sign.signup);
}

router.post('/login', sign.login);
router.get('/config/', site.config);
router.get('/active_user', sign.activeUser);
router.post('/reactive', sign.reActive);
router.get('/signout', sign.signOut);
router.post('/updatepass', sign.updatePass);

module.exports = router;
