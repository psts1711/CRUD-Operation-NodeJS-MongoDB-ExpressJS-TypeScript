"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GlobalMiddleware_1 = require("../middleware/GlobalMiddleware");
const PostValidators_1 = require("../validators/PostValidators");
const PostController_1 = require("../controllers/PostController");
class PostRouter {
    constructor() {
        this.router = express_1.Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoute();
    }
    getRoutes() {
        this.router.get('/me', GlobalMiddleware_1.GlobalMiddleware.authroute, PostController_1.PostController.getPostByUser);
        this.router.get('/all', GlobalMiddleware_1.GlobalMiddleware.authroute, PostController_1.PostController.getAllPost);
        this.router.get('/:id', GlobalMiddleware_1.GlobalMiddleware.authroute, PostValidators_1.PostValidators.getPostById(), GlobalMiddleware_1.GlobalMiddleware.checkError, PostController_1.PostController.getPostById);
    }
    postRoutes() {
        this.router.post('/add', GlobalMiddleware_1.GlobalMiddleware.authroute, PostValidators_1.PostValidators.addPost(), GlobalMiddleware_1.GlobalMiddleware.checkError, PostController_1.PostController.addPost);
    }
    patchRoutes() {
        this.router.patch('/edit/:id', GlobalMiddleware_1.GlobalMiddleware.authroute, PostValidators_1.PostValidators.editPost(), GlobalMiddleware_1.GlobalMiddleware.checkError, PostController_1.PostController.editPost);
    }
    deleteRoute() {
        this.router.delete('/delete/:id', GlobalMiddleware_1.GlobalMiddleware.authroute, PostValidators_1.PostValidators.deletePost(), GlobalMiddleware_1.GlobalMiddleware.checkError, PostController_1.PostController.deletePost);
    }
}
exports.default = new PostRouter().router;
