import {body, param} from "express-validator";
import Post from "../models/Post";
import Comment from "../models/Comment";

export class PostValidators{

    static addPost(){
        return [
            body('content', 'Post content is required!').isString(),
        ];
    }

    static getPostById(){
        return [
            param('id').custom((id,{req})=>{
                return Post.findOne({_id: id}, {__v:0, user_id:0}).populate('comments').then((post)=>{
                    if(post){
                        req.post = post;
                        return true;
                    }else{
                        throw new Error('Post does not exist')
                    }
                })
            })
        ]
    }

    static editPost(){
        return [
            body('content', 'Content is required').isString()
        ]
    }

    static deletePost(){
        return [
            param('id').custom((id,{req})=>{
                return Post.findOne({_id: id}, {__v:0, user_id:0}).then((post)=>{
                    if(post){
                        req.post = post;
                        return true;
                    }else{
                        throw new Error('Post does not exist')
                    }
                })
            })
        ]
    }

}