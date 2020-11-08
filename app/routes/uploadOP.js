const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/api'});
const { upload, download, downloadAll, checkPermission } = require('../controllers/uploadOP')

const { secret } = require('../config');
const auth = jwt({ secret });

router.post('/upload', upload);

router.post('/download/:fname', auth, checkPermission, download);

// router.post('/upload/downloadAll', auth, checkPermission, upload);

module.exports = router;