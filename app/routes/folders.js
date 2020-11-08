const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/api/folders'});
const { secret } = require('../config');
const {
    find, findById, findByUser, create, update, delete: del,
    checkOwner, checkPermission, checkFolderExist
} = require('../controllers/folders');

const auth = jwt({ secret });

router.get('/', find);
router.get('/users/:uid', findByUser);
router.get('/:id', findById);
router.post('/', auth, checkPermission, create);
router.patch('/:id', auth, checkFolderExist, checkPermission, checkOwner, update);
router.delete('/:id', auth, checkFolderExist, checkPermission, checkOwner, del);

module.exports = router;