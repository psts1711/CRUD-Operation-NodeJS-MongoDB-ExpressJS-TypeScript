"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const UserValidators_1 = require("../validators/UserValidators");
const GlobalMiddleware_1 = require("../middleware/GlobalMiddleware");
const Utils_1 = require("../Utils/Utils");
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoute();
    }
    getRoutes() {
        //this.router.get('/login',UserController.login)
        // this.router.post('/login',UserValidators.login(),UserController.login)
        // console.log('route log');
        // this.router.get('/emailresend', UserValidators.resendVerificationEmail, UserController.resendVerificationEmail, GlobalMiddleware.checkError);
        // emailresend is protected route
        this.router.get('/send/verification/email', GlobalMiddleware_1.GlobalMiddleware.authroute, UserController_1.UserController.resendVerificationEmail);
        //  this.router.get('/checkpassword', UserController.checkPassowrd);
        this.router.get('/login', UserValidators_1.UserValidators.login(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.login);
        // password ko reset karne ke liiye user email send karega // forget password
        this.router.get('/reset/password', UserValidators_1.UserValidators.sendResetPasswordOnEmail(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.sendResetPasswordOnEmail);
        this.router.get('/verify/reset/PasswordToken', UserValidators_1.UserValidators.verifyResetPasswordToken(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.verifyResetPasswordToken);
        this.router.get('/test/query', UserController_1.UserController.test);
        this.router.get('/test', UserController_1.UserController.dbtest);
    }
    postRoutes() {
        this.router.post('/signup', UserValidators_1.UserValidators.signUp(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.signUp);
    }
    patchRoutes() {
        this.router.patch('/verify', GlobalMiddleware_1.GlobalMiddleware.authroute, UserValidators_1.UserValidators.verifyUser(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.verifyUserToken);
        this.router.patch('/update/password', GlobalMiddleware_1.GlobalMiddleware.authroute, UserValidators_1.UserValidators.updatePassword(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.updatePassword);
        this.router.patch('/reset/password', UserValidators_1.UserValidators.resetPassword(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.ResetPassowrd);
        this.router.patch('/update/profilePic', GlobalMiddleware_1.GlobalMiddleware.authroute, new Utils_1.Utils().multer.single('profile_pic'), UserValidators_1.UserValidators.updateProfilePic(), GlobalMiddleware_1.GlobalMiddleware.checkError, UserController_1.UserController.updateProfilePic);
    }
    deleteRoute() {
    }
}
exports.default = new UserRouter().router;
