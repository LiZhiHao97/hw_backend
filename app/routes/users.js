const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({prefix: '/api/users'});

const {
    find, findById,
    create, update,
    delete: del,
    login,
    checkOwner,
    checkPermission
} = require('../controllers/users');

const { secret } = require('../config');

const auth = jwt({ secret });

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

router.patch('/:id', auth, checkPermission, update);

router.delete('/:id', auth, checkPermission, del);

router.post('/login', login);

module.exports = router;
