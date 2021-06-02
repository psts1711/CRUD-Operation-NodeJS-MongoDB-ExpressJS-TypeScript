import {Router} from "express";
import {GlobalMiddleware} from "../middleware/GlobalMiddleware";
import {CommentValidators} from "../validators/CommentValidators";
import {CommentController} from "../controllers/CommentController";
import {PostValidators} from "../validators/PostValidators";
import {PostController} from "../controllers/PostController";

class CommentRouter{
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoute();
    }

    getRoutes(){

    }

    postRoutes(){
        this.router.post('/add/:id', GlobalMiddleware.authroute, CommentValidators.addComment(),
            GlobalMiddleware.checkError, CommentController.addComment)
    }

    patchRoutes(){
        this.router.patch('/edit/:id', GlobalMiddleware.authroute,
            CommentValidators.editComment(),GlobalMiddleware.checkError, CommentController.editComment)
    }

    deleteRoute(){
        this.router.delete('/delete/:id', GlobalMiddleware.authroute,
            CommentValidators.deleteComment(),GlobalMiddleware.checkError, CommentController.deleteComment)
    }
}

export default new CommentRouter().router;