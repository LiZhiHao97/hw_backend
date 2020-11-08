const Folder = require('../models/folders');

class FoldersController {
    async find (ctx) {
        ctx.body = await Folder.find({title: new RegExp(ctx.query.q)})
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const folder = await Folder.findById(ctx.params.id).select(selectFields)
        if (!folder) {
            ctx.throw(404, '文件夹不存在');
        }
        ctx.body = folder;
    }

    async findByUser(ctx) {
        ctx.body = await Folder.find({ owner: ctx.params.uid })
    }
    
    async create (ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true }
        })
        const { title } = ctx.request.body;
        const repeatedFolder = await Folder.findOne({title, owner: ctx.state.user._id});
        if (repeatedFolder) {
            ctx.throw(409, '该文件夹已存在');
        }
        const owner = ctx.state.user._id;
        const folder = await new Folder({...ctx.request.body, owner}).save();
        const newFolder = await Folder.findById(folder._id)
        ctx.body = newFolder;
    }

    async update (ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true }
        })
        const { title } = ctx.request.body;
        const repeatedFolder = await Folder.findOne({title, owner: ctx.state.user._id});
        if (repeatedFolder) {
            ctx.throw(409, '该文件夹已存在');
        }
        const folder = await Folder.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = folder;
    }
    
    async delete (ctx) {
        await Folder.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    async checkFolderExist(ctx, next) {
        const folder = await Folder.findById(ctx.params.id);
        if (!folder) {
            ctx.throw(404, '该文件夹不存在');
        }
        ctx.state.folder = folder;
        await next();
    }
    
    async checkOwner(ctx, next) {
        const { folder } = ctx.state;
        if (folder.owner.toString() !== ctx.state.user._id) {
            ctx.throw(403, "您没有权限这样做");
        }
        await next();
    }
    
    async checkPermission(ctx, next) {
        if (ctx.state.user.role === 2) {
            ctx.throw(403, '您没有操作权限');
        }
        await next();
    }
}

module.exports = new FoldersController();