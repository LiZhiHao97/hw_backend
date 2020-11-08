const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const { secret } = require('../config');

class UsersController {
    async find (ctx) {
        ctx.body = await User.find({username: new RegExp(ctx.query.q)})
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const user = await User.findById(ctx.params.id).select(selectFields)
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }

    async create (ctx) {
        ctx.verifyParams({
            username: { type: 'string', required: true },
            password: {type: 'string', required: true},
            role: { type: 'number', required: false }
        });
        const { username } = ctx.request.body;
        const repeatedUser = await User.findOne({username});
        if (repeatedUser) {
            ctx.throw(409, '用户名已存在');
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    async update (ctx) {
        ctx.verifyParams({
            user: { type: 'string', required: false },
            password: { type: 'string', required: false },
            role: { type: 'number', required: false }
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }
    
    async delete (ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.status = 204;
    }

    async login(ctx) {
        ctx.verifyParams({
            username: { type: 'string', required: true },
            password: { type: 'string', required: true }
        })
        const user = await User.findOne(ctx.request.body)
        if (!user) {
            ctx.throw(401, '用户名或密码不正确')
        }
        const { _id, username, role } = user;;
        const token = jsonwebtoken.sign({_id, username, role}, secret, {expiresIn: '1d'});
        const userData = { token, user };
        ctx.body = { userData };
    }

    async checkOwner(ctx, next) {
        if (ctx.params.id != ctx.state.user._id) {
            ctx.throw(403, '您没有操作权限');
        }
        await next();
    }

    async checkPermission(ctx, next) {
        console.log(ctx.state.user)
        if (ctx.state.user.role !== 0) {
            ctx.throw(403, '您没有操作权限');
        }
        await next();
    }
     
}

module.exports = new UsersController();