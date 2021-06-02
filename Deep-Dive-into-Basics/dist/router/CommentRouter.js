"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GlobalMiddleware_1 = require("../middleware/GlobalMiddleware");
const CommentValidators_1 = require("../validators/CommentValidators");
const CommentController_1 = require("../controllers/CommentController");
class CommentRouter {
    constructor() {
        this.router = express_1.Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoute();
    }
    getRoutes() {
    }
    postRoutes() {
        this.router.post('/add/:id', GlobalMiddleware_1.GlobalMiddleware.authroute, CommentValidators_1.CommentValidators.addComment(), GlobalMiddleware_1.GlobalMiddleware.checkError, CommentController_1.CommentController.addComment);
    }
    patchRoutes() {
        this.router.patch('/edit/:id', GlobalMiddleware_1.GlobalMiddleware.authroute, CommentValidators_1.CommentValidators.editComment(), GlobalMiddleware_1.GlobalMiddleware.checkError, CommentController_1.CommentController.editComment);
    }
    deleteRoute() {
        this.router.delete('/delete/:id', GlobalMiddleware_1.GlobalMiddleware.authroute, CommentValidators_1.CommentValidators.deleteComment(), GlobalMiddleware_1.GlobalMiddleware.checkError, CommentController_1.CommentController.deleteComment);
    }
}
exports.default = new CommentRouter().router;
