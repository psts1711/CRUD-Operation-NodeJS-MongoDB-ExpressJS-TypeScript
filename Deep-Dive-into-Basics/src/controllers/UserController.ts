import User from "../models/User";
import { validationResult } from "express-validator";
import {Utils} from "../Utils/Utils";
import {NodeMailer} from "../Utils/NodeMailer";
import * as Bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {getEnvirmentVariables} from "../environments/env";

export class UserController{

    // signup user - post method
    static async signUp(req, res, next)
    {
       //  console.log(Utils.generateVerificationToken());


        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const verificationToken = Utils.generateVerificationToken();

        try {
            const hash = await Utils.encryptPassword(password);
            const data = {
                email: email,
                username: username,
                password: hash,
                verification_token: verificationToken,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                created_at: new Date(),
                updated_at: new Date()
            };

            let user = await new User(data).save();
            res.send(user);

            // Send Verification Email

            await NodeMailer.sendEmail({to:['amitkumar.sinha.910@gmail.com'], subject:'Your OTP Key', html:`<h1>Your Verification OTP is: ${verificationToken}</h1>`}).then(()=>{
                console.log('success')
            }).catch(err=>{
                console.log(err)
            })

        }catch (e) {
            next(e)
        }

    }


    // check and verifiy token using patch method
    static async verifyUserToken(req,res,next)
    {
        const verficationToken = req.body.verification_token;
        const email = req.user.email;
        // const email = req.body.email;

        //console.log(email)

        try {
            const user = await User.findOneAndUpdate({email: email, verification_token: verficationToken,
                verification_token_time:{$lt: Date.now()}
            }, {verified: true, updated_at: new Date()}, {new: true});

            console.log(user)

            if(user) {
                res.send(user);
            }else {
                throw new Error('Verification token is expired. Please request for a new one.')
            }

        }catch (e) {
            next(e)
        }
    }

    // resend verification otp on email - get method
    static async resendVerificationEmail(req,res,next){

        //const email = req.query.email;
        const email = req.user.email;

        const verificationToken = Utils.generateVerificationToken();


        try{
           const user : any = await User.findOneAndUpdate({email: email}, {
                verification_token: verificationToken,
                verification_token_time : Date.now() + new Utils().MAX_TOKEN_TIME,
            });

           if(user){

               await NodeMailer.sendEmail({to:[user.email], subject:'Your New OTP Key', html:`<h1>Your Updated Verification OTP is: ${verificationToken}</h1>`}).then(()=>{
                   console.log('success')
               }).catch(err=>{
                   console.log(err)
               })

               res.json({
                   success: true
               });

           }else{
               throw Error('User does not exit')
           }

        }catch (e) {
            next(e)
        }
    }

    // check password - get method
    static async checkPassowrd(req,res,next){
        const email = req.query.email;
        const password = req.query.password;

        User.findOne({email:email}).then((user:any)=>{

            Bcrypt.compare(password, user.password, (err, same)=>{
                res.send(same);
                //console.log(same);
            })

        })
    }

    static async login(req, res, next)
    {

        const password = req.query.password;
        const user = req.user;

        try {
           await Utils.comparePassword({plainPassword: password, encryptedPassword: user.password});
           const token = jwt.sign({email:user.email, user_id: user._id}, getEnvirmentVariables().jwt_secret, {expiresIn: '120d'})
           const data = {
               user:user,
               token:token
           }
           res.json(data)
        }catch (e) {
            next(e)
        }


    }

    static async updatePassword(req,res,next){

        const user_id = req.user.user_id;
        const password = req.body.password;
        const newPassword = req.body.new_password;

        try {
            const user : any= await User.findOne({_id:user_id});

            await Utils.comparePassword({plainPassword:password,
                encryptedPassword:user.password
            })

            const encryptedPassword = await Utils.encryptPassword(newPassword)
            const newUser = await User.findOneAndUpdate({_id:user_id}, {password: encryptedPassword}, {new: true})
            res.send(newUser);

        }catch (e) {
            next(e);
        }
    }

    static async ResetPassowrd(req,res,next){
        const user = req.user;
        const newPassword = req.body.new_password;
        
        try {
            const encrytedPassword = await Utils.encryptPassword(newPassword);
            const updateUser = await User.findOneAndUpdate({_id: user._id}, {

                updated_at: new Date(),
                password: encrytedPassword

            }, {new:true})
            res.send(updateUser);
        }catch (e) {
            next(e)
        }
    }

    static async sendResetPasswordOnEmail(req,res,next){
        const email = req.query.email;
        const resetPasswordToken = Utils.generateVerificationToken();

        try {
            const updatedUser = await User.findOneAndUpdate({email:email},
                {updated_at: new Date(),
                    reset_password_token: resetPasswordToken,
                    reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME},
                {new: true})
            res.send(updatedUser)

            NodeMailer.sendEmail({to:[email], subject:'Reset Password Email and OTP', html:`<h1>Your Updated Verification OTP is: ${resetPasswordToken}</h1>`})

        }catch (e) {
            next(e)
        }
    }


    static verifyResetPasswordToken(req,res,next){
        res.send({
            success: true
        })
    }


    static async updateProfilePic(req, res, next){
       // res.send(req.file)

        const userId = req.user.user_id;

        /* for mac / linux Configuaration */
       // const fileURL = 'http://localhost:7000/' + req.file.path;

        /* for Windows Configuaration */
        const filePath = req.file.path.replaceAll('\\','/');
        const fileURL = 'http://localhost:7000/' + filePath


        try {

          const user = await  User.findOneAndUpdate({_id: userId}, {
                updated_at: new Date(),
                profile_pic_url: fileURL
            }, {new: true})

            res.send(user)

        }catch (e) {
          next(e)
        }
    }


    // test
    static test(req,res,next){

      //  ye pura records return karega
        User.find({}).then(user=>{
            //res.send(user)

        })

        // ye sirf all verified:true ko return karega
        User.find({verified:true}).then(user=>{
           // res.send(user)

        })

        // projection
        User.find({verified:true}, {__v:0}).then(user=>{
           // res.send(user)

        })

        // return specific field
        User.find({verified:true}).select('username email password').then(user=>{
            res.send(user)

        })
    }

    static async dbtest(req,res, next)
    {
       // const user = await User.find({email: 'admin@user.com'}).
      //  setOptions({explain:'executionStats'})

        const user = await User.find({verified: true,
            password:'$2b$10$jVtOzVQi2sHbXUMC6SS6rOC1x57jnQTQL6zi4bfg27HB7IJJ9JDKm'})
            .setOptions({explain:'executionStats'})


        res.send(user)
    }
}