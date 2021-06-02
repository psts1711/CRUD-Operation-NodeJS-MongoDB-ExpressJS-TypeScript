"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const Utils_1 = require("../Utils/Utils");
const NodeMailer_1 = require("../Utils/NodeMailer");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env_1 = require("../environments/env");
class UserController {
    // signup user - post method
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            //  console.log(Utils.generateVerificationToken());
            const email = req.body.email;
            const password = req.body.password;
            const username = req.body.username;
            const verificationToken = Utils_1.Utils.generateVerificationToken();
            try {
                const hash = yield Utils_1.Utils.encryptPassword(password);
                const data = {
                    email: email,
                    username: username,
                    password: hash,
                    verification_token: verificationToken,
                    verification_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                let user = yield new User_1.default(data).save();
                res.send(user);
                // Send Verification Email
                yield NodeMailer_1.NodeMailer.sendEmail({ to: ['amitkumar.sinha.910@gmail.com'], subject: 'Your OTP Key', html: `<h1>Your Verification OTP is: ${verificationToken}</h1>` }).then(() => {
                    console.log('success');
                }).catch(err => {
                    console.log(err);
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // check and verifiy token using patch method
    static verifyUserToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const verficationToken = req.body.verification_token;
            const email = req.user.email;
            // const email = req.body.email;
            //console.log(email)
            try {
                const user = yield User_1.default.findOneAndUpdate({ email: email, verification_token: verficationToken,
                    verification_token_time: { $lt: Date.now() }
                }, { verified: true, updated_at: new Date() }, { new: true });
                console.log(user);
                if (user) {
                    res.send(user);
                }
                else {
                    throw new Error('Verification token is expired. Please request for a new one.');
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    // resend verification otp on email - get method
    static resendVerificationEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            //const email = req.query.email;
            const email = req.user.email;
            const verificationToken = Utils_1.Utils.generateVerificationToken();
            try {
                const user = yield User_1.default.findOneAndUpdate({ email: email }, {
                    verification_token: verificationToken,
                    verification_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME,
                });
                if (user) {
                    yield NodeMailer_1.NodeMailer.sendEmail({ to: [user.email], subject: 'Your New OTP Key', html: `<h1>Your Updated Verification OTP is: ${verificationToken}</h1>` }).then(() => {
                        console.log('success');
                    }).catch(err => {
                        console.log(err);
                    });
                    res.json({
                        success: true
                    });
                }
                else {
                    throw Error('User does not exit');
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    // check password - get method
    static checkPassowrd(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const password = req.query.password;
            User_1.default.findOne({ email: email }).then((user) => {
                Bcrypt.compare(password, user.password, (err, same) => {
                    res.send(same);
                    //console.log(same);
                });
            });
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.query.password;
            const user = req.user;
            try {
                yield Utils_1.Utils.comparePassword({ plainPassword: password, encryptedPassword: user.password });
                const token = jwt.sign({ email: user.email, user_id: user._id }, env_1.getEnvirmentVariables().jwt_secret, { expiresIn: '120d' });
                const data = {
                    user: user,
                    token: token
                };
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user.user_id;
            const password = req.body.password;
            const newPassword = req.body.new_password;
            try {
                const user = yield User_1.default.findOne({ _id: user_id });
                yield Utils_1.Utils.comparePassword({ plainPassword: password,
                    encryptedPassword: user.password
                });
                const encryptedPassword = yield Utils_1.Utils.encryptPassword(newPassword);
                const newUser = yield User_1.default.findOneAndUpdate({ _id: user_id }, { password: encryptedPassword }, { new: true });
                res.send(newUser);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static ResetPassowrd(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const newPassword = req.body.new_password;
            try {
                const encrytedPassword = yield Utils_1.Utils.encryptPassword(newPassword);
                const updateUser = yield User_1.default.findOneAndUpdate({ _id: user._id }, {
                    updated_at: new Date(),
                    password: encrytedPassword
                }, { new: true });
                res.send(updateUser);
            }
            catch (e) {
                next(e);
            }
        });
    }
    static sendResetPasswordOnEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            const resetPasswordToken = Utils_1.Utils.generateVerificationToken();
            try {
                const updatedUser = yield User_1.default.findOneAndUpdate({ email: email }, { updated_at: new Date(),
                    reset_password_token: resetPasswordToken,
                    reset_password_token_time: Date.now() + new Utils_1.Utils().MAX_TOKEN_TIME }, { new: true });
                res.send(updatedUser);
                NodeMailer_1.NodeMailer.sendEmail({ to: [email], subject: 'Reset Password Email and OTP', html: `<h1>Your Updated Verification OTP is: ${resetPasswordToken}</h1>` });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static verifyResetPasswordToken(req, res, next) {
        res.send({
            success: true
        });
    }
    static updateProfilePic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // res.send(req.file)
            const userId = req.user.user_id;
            /* for mac / linux Configuaration */
            // const fileURL = 'http://localhost:7000/' + req.file.path;
            /* for Windows Configuaration */
            const filePath = req.file.path.replaceAll('\\', '/');
            const fileURL = 'http://localhost:7000/' + filePath;
            try {
                const user = yield User_1.default.findOneAndUpdate({ _id: userId }, {
                    updated_at: new Date(),
                    profile_pic_url: fileURL
                }, { new: true });
                res.send(user);
            }
            catch (e) {
                next(e);
            }
        });
    }
    // test
    static test(req, res, next) {
        //  ye pura records return karega
        User_1.default.find({}).then(user => {
            //res.send(user)
        });
        // ye sirf all verified:true ko return karega
        User_1.default.find({ verified: true }).then(user => {
            // res.send(user)
        });
        // projection
        User_1.default.find({ verified: true }, { __v: 0 }).then(user => {
            // res.send(user)
        });
        // return specific field
        User_1.default.find({ verified: true }).select('username email password').then(user => {
            res.send(user);
        });
    }
    static dbtest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // const user = await User.find({email: 'admin@user.com'}).
            //  setOptions({explain:'executionStats'})
            const user = yield User_1.default.find({ verified: true,
                password: '$2b$10$jVtOzVQi2sHbXUMC6SS6rOC1x57jnQTQL6zi4bfg27HB7IJJ9JDKm' })
                .setOptions({ explain: 'executionStats' });
            res.send(user);
        });
    }
}
exports.UserController = UserController;
