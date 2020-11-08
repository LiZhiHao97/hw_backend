const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/api/files'});
const { secret } = require('../config');
const {
    find, findById, findByFolder, create, delete: del,
    checkPermission, checkFileExist, checkFolderExist
} = require('../controllers/files');

const auth = jwt({ secret });

router.get('/', find);
router.get('/folders/:folderid', checkFolderExist, findByFolder);
router.get('/:id', findById);
router.post('/folders/:folderid', auth, checkFolderExist, create);
router.delete('/:id', auth, checkFileExist, checkPermission, del);

module.exports = router;