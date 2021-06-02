"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidators = void 0;
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
class UserValidators {
    static signUp() {
        return [
            // Email Validation
            express_validator_1.body('email', 'Email is required').isEmail().custom((email, { req }) => {
                console.log(req.body);
                return User_1.default.findOne({ email: email }).then(user => {
                    if (user) {
                        throw new Error('User Already Exist');
                    }
                    else {
                        return true;
                    }
                });
            }),
            // Password Validation
            express_validator_1.body('password', 'Password is required')
                .isAlphanumeric().isLength({ min: 8, max: 20 })
                .withMessage('Password can be from 8-20 character'),
            // Username Validation
            express_validator_1.body('username', 'Username is required').isString()
        ];
    }
    static verifyUser() {
        return [
            //body('email', 'Email is required').isEmail(),
            express_validator_1.body('verification_token', 'Verification token is required').isNumeric()
        ];
    }
    static resendVerificationEmail() {
        return [
            express_validator_1.query('email', 'Email is required').isEmail()
        ];
    }
    static updatePassword() {
        return [
            express_validator_1.body('password', 'Password is required').isAlphanumeric(),
            express_validator_1.body('confirm_password', 'Confirm Password is required').isAlphanumeric(),
            express_validator_1.body('new_password', 'New Password is required')
                .isAlphanumeric().custom((newPassword, { req }) => {
                if (newPassword === req.body.confirm_password) {
                    return true;
                }
                else {
                    req.errorStatus = 422;
                    throw new Error('New Password and Confirm Password is not matched!');
                }
            }),
        ];
    }
    static sendResetPasswordOnEmail() {
        return [
            express_validator_1.query('email', 'Email is required').isEmail().custom((email, { req }) => {
                return User_1.default.findOne({ email: email }).then(user => {
                    if (user) {
                        // req.user = user;
                        return true;
                    }
                    else {
                        throw new Error('Email Does Not Exit');
                    }
                });
            })
        ];
    }
    static resetPassword() {
        return [
            express_validator_1.body('email', 'Email is required').isEmail().custom((email, { req }) => {
                return User_1.default.findOne({ email: email }).then(user => {
                    if (user) {
                        req.user = user;
                        return true;
                    }
                    else {
                        throw new Error('User Does Not Exit');
                    }
                });
            }),
            express_validator_1.body('new_password', 'New Password is required').isAlphanumeric().custom((newPassword, { req }) => {
                if (newPassword == req.body.confirm_password) {
                    return true;
                }
                else {
                    throw new Error('New Password and Confirm Password Does Not Matched!');
                }
            }),
            express_validator_1.body('confirm_password', 'Confirm Password is required').isAlphanumeric(),
            express_validator_1.body('reset_password_token', 'Reset Password Token is required').isNumeric().
                custom((token, { req }) => {
                if (Number(req.user.reset_password_token) === Number(token)) {
                    return true;
                }
                else {
                    req.errorStatus = 422;
                    throw new Error('Reset Password Token is Invalid.');
                }
            })
        ];
    }
    static verifyResetPasswordToken() {
        return [
            express_validator_1.query('reset_password_token', 'Password Reset token is required')
                .isNumeric().custom((token, { req }) => {
                return User_1.default.findOne({
                    reset_password_token: token,
                    reset_password_token_time: { $gt: Date.now() }
                }).then((user) => {
                    if (user) {
                        return true;
                    }
                    else {
                        throw new Error('Token does not exits, please request for a new one');
                    }
                });
            })
        ];
    }
    static login() {
        return [
            express_validator_1.query('email', 'Email is required').isEmail().custom((email, { req }) => {
                return User_1.default.findOne({ email: email }).then(user => {
                    if (user) {
                        req.user = user;
                        return true;
                    }
                    else {
                        throw new Error('User Does Not Exit');
                    }
                });
            }),
            express_validator_1.query('password', 'Passowrd is required').isAlphanumeric()
        ];
    }
    static updateProfilePic() {
        return [
            express_validator_1.body('profile_pic').custom((profilePic, { req }) => {
                // console.log(req.file)
                if (req.file) {
                    return true;
                }
                else {
                    throw new Error('File not uploaded');
                }
            })
        ];
    }
}
exports.UserValidators = UserValidators;
