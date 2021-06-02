import Post from '../models/Post'
import Comment from '../models/Comment'

export class CommentController
{
    static async addComment(req, res, next){
        const content = req.body.content;
        const post = req.post;

        try{

            const comment = new Comment({
                content: content,
                created_at: new Date(),
                updated_at: new Date(),
            });

            post.comments.push(comment)

           await Promise.all([comment.save(), post.save()])

            res.send(comment)

        }catch (e) {
            next(e)
        }
    }

    /*---Patch--*/

    static async editComment(req,res,next){
        const content = req.body.content;
        const commenttId = req.params.id;
        console.log(content);
        console.log(commenttId);

        try {
            const updatedComment = await Comment.findOneAndUpdate({_id:commenttId}, {
                content: content,
                updated_at: new Date()
            }, {new: true})

            if(updatedComment)
            {
                res.send(updatedComment)

            }else{
                throw new Error('Comment does not exist');
            }
        }catch (e) {
            next(e);
        }
    }

    /*---Delete--*/
    static async deleteComment(req,res,next){
        const comment = req.comment;

        try {
            comment.remove();
            res.send(comment)
        }catch (e) {
            next(e)
        }
    }

}