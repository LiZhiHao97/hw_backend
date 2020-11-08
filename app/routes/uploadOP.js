const Router = require('koa-router');
const router = new Router({prefix: '/api'});
const { upload } = require('../controllers/uploadOP')

router.post('/upload', upload);

module.exports = router;