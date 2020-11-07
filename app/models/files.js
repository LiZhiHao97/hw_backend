const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const fileSchema = new Schema({
    __v: {type: Number,select: false},
    title: { type: String, required: true,  unique: true },
    folder: { type: Schema.Types.ObjectId, ref: 'Folder', require: true }
}, { timestamps: true });

module.exports = model('File', fileSchema); 