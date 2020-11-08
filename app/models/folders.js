const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const folderSchema = new Schema({
    __v: {type: Number,select: false},
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', require: true }
}, { timestamps: true });

module.exports = model('Folder', folderSchema); 