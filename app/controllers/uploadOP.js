const path = require('path');
const send = require('koa-send');

class uploadOPController {
    async upload(ctx) {
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);
        ctx.body = { url: `${ctx.origin}/uploads/${basename}`};
    }

    async download(ctx) {
        const name = ctx.params.fname;
        const path = `app/public/uploads/${name}`;
        ctx.attachment(path);
        await send(ctx, path);
    }

    async downloadAll(ctx) {
        ctx.verifyParams({
            names: { type: 'array', required: true }
        })
        const list = [{name: '1.txt'},{name: '2.txt'}];
        const zipName = 'Archive.zip';
        const zipStream = fs.createWriteStream(zipName);
        const zip = archiver('zip');
        zip.pipe(zipStream);
        for (let i = 0; i < list.length; i++) {
            // 添加单个文件到压缩包
            zip.append(fs.createReadStream(list[i].name), { name: list[i].name })
        }
        await zip.finalize();
        ctx.attachment(zipName);
        await send(ctx, zipName);
    }

    async checkPermission(ctx, next) {
        console.log(1)
        if (ctx.state.user.role === 2) {
            ctx.throw(403, '您没有操作权限');
        }
        await next();
    }
}

module.exports = new uploadOPController();