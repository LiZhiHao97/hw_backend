const File = require('../models/files');
const Folder = require('../models/folders')

class FilesController {
    async find (ctx) {
        ctx.body = await File.find({title: new RegExp(ctx.query.q)})
    }

    async findById (ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const file = await File.findById(ctx.params.id).select(selectFields)
        if (!file) {
            ctx.throw(404, '文件不存在');
        }
        ctx.body = file;
    }

    async findByFolder(ctx) {
        ctx.body = await File.find({ folder: ctx.params.folderid })
    }

    async create (ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            serverTitle: { type: 'string', required: true }
        })
        const { title } = ctx.request.body;
        const repeatedFile = await File.findOne({title, folder: ctx.params.folderid});
        if (repeatedFile) {
            ctx.throw(409, '该文件已存在');
        }
        const folder = ctx.params.folderid;
        const file = await new File({...ctx.request.body, folder}).save();
        const newFile = await File.findById(file._id)
        ctx.body = newFile;
    }

    async delete (ctx) {
        await File.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    async checkFolderExist(ctx, next) {
        console.log(ctx.params.folderid)
        const folder = await Folder.findById(ctx.params.folderid);
        if (!folder) {
            ctx.throw(404, '该文件夹不存在');
        }
        ctx.state.folder = folder;
        await next();
    }
    
    async checkFileExist(ctx, next) {
        const file = await File.findById(ctx.params.id);
        if (!file) {
            ctx.throw(404, '该文件不存在');
        }
        ctx.state.file = file;
        await next();
    }

    async checkPermission(ctx, next) {
        if (ctx.state.user.role === 2) {
            ctx.throw(403, '您没有操作权限');
        }
        await next();
    }
}

module.exports = new FilesController();