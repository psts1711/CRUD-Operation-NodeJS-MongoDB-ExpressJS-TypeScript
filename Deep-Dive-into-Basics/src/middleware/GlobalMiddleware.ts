import {validationResult} from "express-validator";
import * as jwt from 'jsonwebtoken';
import {getEnvirmentVariables} from "../environments/env";

export class GlobalMiddleware{

    static checkError(req,res,next)
    {
        const error = validationResult(req);
        if(!error.isEmpty())
        {
            next(new Error(error.array()[0].msg))
            return;
        }
        else
        {
            next();
        }
    }

    static async authroute(req,res,next){
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7, authHeader.length) : null;

        try {

            jwt.verify(token, getEnvirmentVariables().jwt_secret, ((err, decode)=>{

                if(err){
                    next(err)
                }else if(!decode){
                    req.errorStatus = 401;
                    next(new Error('User not Authorised'))
                }else{
                   // res.send(decode)
                    req.user = decode;
                    next();
                }

            }))
        }catch (e) {
            req.errorStatus = 401;
            next(e)
        }
    }
}