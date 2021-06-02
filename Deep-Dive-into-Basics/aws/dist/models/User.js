"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    // email: {type: String, required: true, index:{background:true, unique:true}},
    password: { type: String, required: true },
    profile_pic_url: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false, index: { background: true } },
    verification_token: { type: Number, required: true },
    verification_token_time: { type: Date, required: true },
    // ye field tab add hoga jab koi user password reset karega
    reset_password_token: { type: Number, required: false },
    reset_password_token_time: { type: Date, required: false },
    created_at: { type: Date, required: true, Default: new Date() },
    updated_at: { type: Date, required: true, Default: new Date() },
});
/*----Indexing----*/
userSchema.index({ username: 1, password: 1 }, { background: true });
exports.default = mongoose_1.model('users', userSchema);
