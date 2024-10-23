"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.getPostById = exports.createPost = void 0;
const prisma_lib_1 = __importDefault(require("../libs/prisma.lib"));
const post_validate_1 = require("../validation/post.validate");
const error_1 = require("../errors/error");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { error } = post_validate_1.createPostSchema.validate(req.body);
    if (error) {
        throw new error_1.ErrorWithStatusCode(error.details[0].message, 400);
    }
    const { caption, is_public, location } = req.body;
    try {
        const newPost = yield prisma_lib_1.default.post.create({
            data: {
                caption: caption,
                user_id: Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id),
                is_public: is_public !== null && is_public !== void 0 ? is_public : false,
                location: location !== null && location !== void 0 ? location : null,
                created_at: new Date(),
            },
        });
        const postResponse = {
            id: newPost.id,
            caption: newPost.caption,
            user_id: newPost.user_id,
            is_public: newPost.is_public,
            location: newPost.location,
            created_at: newPost.created_at,
        };
        yield prisma_lib_1.default.database_history.create({ data: {
                user_id: Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id),
                detail: 'new post',
                type: 'POST'
            } });
        res.status(201).json({
            status: true,
            message: 'Post created successfully',
            data: postResponse,
        });
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
    ;
});
exports.createPost = createPost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = post_validate_1.idSchemaPost.validate(req.params);
    if (error) {
        res.status(400).json({
            status: false,
            message: error.details[0].message,
            data: null,
        });
    }
    const { id } = req.params;
    try {
        const post = yield prisma_lib_1.default.post.findUnique({
            where: { id: Number(id) },
        });
        if (!post) {
            throw new error_1.ErrorWithStatusCode("Post not found", 404);
        }
        ;
        const postResponse = {
            id: post.id,
            caption: post.caption,
            user_id: post.user_id,
            is_public: post.is_public,
            location: post.location,
            created_at: post.created_at,
        };
        res.status(200).json({
            status: true,
            message: 'Post fetched successfully',
            data: postResponse,
        });
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
});
exports.getPostById = getPostById;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const posts = yield prisma_lib_1.default.post.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
        });
        const totalPosts = yield prisma_lib_1.default.post.count();
        const postResponse = posts.map(post => ({
            id: post.id,
            caption: post.caption,
            user_id: post.user_id,
            is_public: post.is_public,
            location: post.location,
            created_at: post.created_at,
        }));
        res.status(200).json({
            status: true,
            message: 'Posts fetched successfully',
            data: {
                posts: postResponse,
                pagination: {
                    totalPosts,
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / limit),
                    limit,
                },
            },
        });
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
});
exports.getPosts = getPosts;
