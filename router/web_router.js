var express       = require('express');
var router        = express.Router();
var config        = require('../config/config');
var site          = require('../controllers/site');

router.get('/', site.index);

module.exports = router;
