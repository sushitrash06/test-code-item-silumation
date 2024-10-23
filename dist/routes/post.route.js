"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const postRoute = express_1.default.Router()
    .post("/", auth_middleware_1.verifyToken, post_controller_1.createPost)
    .get("/:id", auth_middleware_1.verifyToken, post_controller_1.getPostById)
    .get("/", auth_middleware_1.verifyToken, post_controller_1.getPosts);
exports.default = postRoute;
