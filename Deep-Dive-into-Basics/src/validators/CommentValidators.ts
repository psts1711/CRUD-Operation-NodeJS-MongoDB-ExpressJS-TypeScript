import {body, param} from "express-validator";
import Post from "../models/Post";
import Comment from "../models/Comment";

export class CommentValidators{

    static addComment(){
        return [
            body('content', 'Content is required!').isString(),
            // check post is exist
            param('id').custom((id,{req})=>{
               return Post.findOne({_id:id}).then((post)=>{
                    if(post){
                        req.post = post;
                        return true;
                    }
                    else{
                        throw new Error('Post does not exist!')
                    }
                })
            })
        ];
    }


    static editComment(){
        return [
            body('content', 'Content is required').isString()
        ]
    }

    static deleteComment(){
        return [
            param('id', 'Id is required').custom((id, {req})=>{
                return Comment.findOne({_id:id}).then((comment)=>{
                    if(comment){
                        req.comment = comment;
                        return true;
                    }else {
                        throw new Error('Comment does not exist;')
                    }
                })
            })
        ]
    }
}