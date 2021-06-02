import {body, query} from "express-validator";
import User from "../models/User";
import {NodeMailer} from "../Utils/NodeMailer";

export class UserValidators{

    static signUp(){
       return [

           // Email Validation
           body('email', 'Email is required').isEmail().custom((email,{req})=>{
               console.log(req.body)
               return User.findOne({email:email}).then(user=>{
                   if(user)
                   {

                       throw new Error('User Already Exist')
                   }
                   else
                   {
                       return true;
                   }
               })
           }),

           // Password Validation
           body('password', 'Password is required')
               .isAlphanumeric().isLength({min: 8, max:20})
               .withMessage('Password can be from 8-20 character'),

           // Username Validation
           body('username', 'Username is required').isString()

       ];
    }

    static verifyUser()
    {
        return [
            //body('email', 'Email is required').isEmail(),
            body('verification_token', 'Verification token is required').isNumeric()

        ]
    }

    static resendVerificationEmail()
    {
        return [
            query('email', 'Email is required').isEmail()
        ]
    }

    static updatePassword()
    {
        return [
            body('password', 'Password is required').isAlphanumeric(),
            body('confirm_password', 'Confirm Password is required').isAlphanumeric(),

            body('new_password', 'New Password is required')
                .isAlphanumeric().custom((newPassword, {req})=>{
                    if(newPassword===req.body.confirm_password){
                        return true
                    }else{
                        req.errorStatus = 422;
                        throw new Error('New Password and Confirm Password is not matched!')
                    }
            }),
        ]
    }

    static sendResetPasswordOnEmail(){
        return [
            query('email', 'Email is required').isEmail().custom((email,{req})=>{
                return User.findOne({email:email}).then(user=>{
                    if(user){
                        // req.user = user;
                        return  true
                    }else {
                        throw new Error('Email Does Not Exit');
                    }

                })
            })
        ]
    }

    static resetPassword(){
        return [
            body('email', 'Email is required').isEmail().custom((email,{req})=>{
                return User.findOne({email:email}).then(user=>{
                    if(user){
                        req.user = user;
                        return  true
                    }else {
                        throw new Error('User Does Not Exit');
                    }

                })
            }),
            body('new_password', 'New Password is required').isAlphanumeric().custom((newPassword,{req})=>{
                if(newPassword==req.body.confirm_password){
                    return true
                }
                else {
                    throw new Error('New Password and Confirm Password Does Not Matched!');
                }
            }),
            body('confirm_password', 'Confirm Password is required').isAlphanumeric(),
            body('reset_password_token', 'Reset Password Token is required').isNumeric().
            custom((token,{req})=>{
                if(Number(req.user.reset_password_token)===Number(token)){
                    return true
                }else{
                    req.errorStatus = 422;
                    throw new Error('Reset Password Token is Invalid.');
                }
            })
        ]

    }

    static verifyResetPasswordToken(){
        return [
            query('reset_password_token', 'Password Reset token is required')
                .isNumeric().custom((token,{req})=>{
                    return User.findOne({
                        reset_password_token: token,
                        reset_password_token_time: {$gt: Date.now()}
                    }).then((user)=>{
                        if(user){
                            return true;
                        }else{
                            throw new Error('Token does not exits, please request for a new one')
                        }
                    })
            })
        ]
    }


    static login(){

        return [
            query('email', 'Email is required').isEmail().custom((email,{req})=>{
               return User.findOne({email:email}).then(user=>{
                   if(user){
                       req.user = user;
                      return  true
                   }else {
                       throw new Error('User Does Not Exit');
                   }

                })
            }),
            query('password', 'Passowrd is required').isAlphanumeric()
        ]
    }

    static updateProfilePic(){
        return [
            body('profile_pic').custom((profilePic,{req})=>{
                // console.log(req.file)

                if(req.file){
                    return true
                }
                else{
                    throw new Error('File not uploaded');
                }
            })
        ]
    }


}