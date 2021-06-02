import {Router} from "express";
import {GlobalMiddleware} from "../middleware/GlobalMiddleware";
import {PostValidators} from "../validators/PostValidators";
import {PostController} from "../controllers/PostController";
import {CommentValidators} from "../validators/CommentValidators";
import {CommentController} from "../controllers/CommentController";

class PostRouter{
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoute();

    }

    getRoutes(){
        this.router.get('/me', GlobalMiddleware.authroute, PostController.getPostByUser);
        this.router.get('/all', GlobalMiddleware.authroute, PostController.getAllPost);

        this.router.get('/:id', GlobalMiddleware.authroute,
            PostValidators.getPostById(), GlobalMiddleware.checkError, PostController.getPostById);

    }

    postRoutes(){
        this.router.post('/add', GlobalMiddleware.authroute, PostValidators.addPost(),
                          GlobalMiddleware.checkError, PostController.addPost)
    }

    patchRoutes(){
        this.router.patch('/edit/:id', GlobalMiddleware.authroute,
            PostValidators.editPost(),GlobalMiddleware.checkError, PostController.editPost)
    }

    deleteRoute(){
        this.router.delete('/delete/:id', GlobalMiddleware.authroute,
            PostValidators.deletePost(),GlobalMiddleware.checkError, PostController.deletePost)
    }
}

export default new PostRouter().router;