const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: {type: Number,select: false},
    username: { type: String, required: true,  unique: true },
    password: { type: String, require: true, select: false },
    role: { type: Number, enum: [0, 1, 2], default: 2 },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', require: false }
}, { timestamps: true });

module.exports = model('User', userSchema); 