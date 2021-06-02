import { Router } from "express";
import { UserController } from "../controllers/UserController";
import {body} from 'express-validator'
import {UserValidators} from "../validators/UserValidators";
import {GlobalMiddleware} from "../middleware/GlobalMiddleware";
import {Utils} from "../Utils/Utils";

 class UserRouter{
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoute();

    }
    
    getRoutes()
    {
        //this.router.get('/login',UserController.login)
        // this.router.post('/login',UserValidators.login(),UserController.login)
        // console.log('route log');

        // this.router.get('/emailresend', UserValidators.resendVerificationEmail, UserController.resendVerificationEmail, GlobalMiddleware.checkError);


        // emailresend is protected route
        this.router.get('/send/verification/email', GlobalMiddleware.authroute, UserController.resendVerificationEmail );


      //  this.router.get('/checkpassword', UserController.checkPassowrd);
        this.router.get('/login',UserValidators.login(), GlobalMiddleware.checkError, UserController.login)


        // password ko reset karne ke liiye user email send karega // forget password
        this.router.get('/reset/password', UserValidators.sendResetPasswordOnEmail(), GlobalMiddleware.checkError, UserController.sendResetPasswordOnEmail);
        this.router.get('/verify/reset/PasswordToken', UserValidators.verifyResetPasswordToken(), GlobalMiddleware.checkError, UserController.verifyResetPasswordToken)


        this.router.get('/test/query', UserController.test)
        this.router.get('/test', UserController.dbtest)

    }

    postRoutes()
    {
        this.router.post('/signup',UserValidators.signUp(), GlobalMiddleware.checkError, UserController.signUp);

    }

    patchRoutes()
    {
        this.router.patch('/verify', GlobalMiddleware.authroute, UserValidators.verifyUser(), GlobalMiddleware.checkError, UserController.verifyUserToken)

        this.router.patch('/update/password', GlobalMiddleware.authroute, UserValidators.updatePassword(), GlobalMiddleware.checkError, UserController.updatePassword)

        this.router.patch('/reset/password', UserValidators.resetPassword(), GlobalMiddleware.checkError, UserController.ResetPassowrd)

        this.router.patch('/update/profilePic', GlobalMiddleware.authroute,
            new Utils().multer.single('profile_pic'), UserValidators.updateProfilePic(), GlobalMiddleware.checkError, UserController.updateProfilePic)
    }

    deleteRoute()
    {

    }
}

export default new UserRouter().router;