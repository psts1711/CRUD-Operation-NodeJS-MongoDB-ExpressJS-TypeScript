import Post from "../models/Post";

export class PostController{

    static async addPost(req,res,next){
        const userId = req.user.user_id;
        const content = req.body.content;
        const post = new Post({
            user_id: userId,
            content: content,
            created_at: new Date(),
            updated_at: new Date(),
        });
        post.save().then((post)=>{
            res.send(post);
        }).catch(err=>{
            next(err);
        });
    }

    static async getAllPost(req,res,next){

        /* Adding Pagination*/
        const page = parseInt(req.query.page) || 1;
        const perPage = 2;
        let currentPage = page;
        let previousPage = page === 1 ? null : page-1
        let nextPageToken = page + 1
        let totalPages;

        try {

            const postCount = await Post.estimatedDocumentCount();
            totalPages = Math.ceil(postCount/perPage);

            if(totalPages===page || totalPages===0)
            {
                nextPageToken = null;
            }

            if(page>totalPages){
                throw new Error('No More Post To Show')
            }

            const posts: any = await Post.find({}, {user_id:0, __v:0}).
            populate('comments').skip((perPage*page)-perPage).limit(perPage);

          //  console.log(posts[0].commentCount)

            res.json({
                post: posts,
                nextPageToken: nextPageToken,
                totalPages: totalPages,
                currentPage: currentPage,
                previousPage: previousPage,
               // count: posts[0].commentCount
            });

        }catch (e) {
            next(e)
        }

    }

    static async getPostByUser(req,res,next){
        const userId = req.user.user_id;

        /* Adding Pagination*/
        const page = parseInt(req.query.page) || 1;
        const perPage = 2;
        let currentPage = page;
        let previousPage = page === 1 ? null : page-1
        let nextPageToken = page + 1
        let totalPages;

        try {

            const postCount = await Post.countDocuments({user_id: userId});
            totalPages = Math.ceil(postCount/perPage);

            if(totalPages===page || totalPages===0)
            {
                nextPageToken = null;
            }

            if(page>totalPages){
                throw new Error('No More Post To Show')
            }

            const posts: any = await Post.find({user_id: userId}, {user_id:0, __v:0}).
            populate('comments').skip((perPage*page)-perPage).limit(perPage);

             res.json({
                 post: posts,
                 nextPageToken: nextPageToken,
                 totalPages: totalPages,
                 currentPage: currentPage,
                 previousPage: previousPage,
                // count: posts[0].commentCount
             });

            /*------------------------------------*/
            // const posts = await Post.findOne({user_id: userId}).exec();
            // const posts = await Post.find({user_id: userId}).exec();

            // pura comments show karne ke liye
            // const posts = await Post.findOne({user_id: userId}).populate('comments').exec();

          // const posts = await Post.findOne({user_id: userId}, {user_id:0, __v:0}).populate('comments').exec();

           // const posts = await Post.find({user_id: userId}, {user_id:0, __v:0}).populate('comments').exec();

          //  res.send(posts);
        }catch (e) {
            next(e)
        }
    }

    static async getPostById(req, res, next){
        res.json({
            post: req.post,
            commentCount: req.post.commentCount
        })
    }

    /*---Patch--*/

    static async editPost(req,res,next){
        const content = req.body.content;
        const postId = req.params.id;
        console.log(content);
        console.log(postId);

        try {
            const updatedPost = await Post.findOneAndUpdate({_id:postId}, {
                content: content,
                updated_at: new Date()
            }, {new: true}).populate('comments')

            if(updatedPost){
                res.send(updatedPost)

            }else{
                throw new Error('Post does not exist');
            }
        }catch (e) {
            next(e);
        }
    }


    /*---Delete--*/
    static async deletePost(req,res,next){
        const post = req.post;

        try {
            await post.remove();
            res.send(post)
        }catch (e) {
            next(e)
        }
    }

}