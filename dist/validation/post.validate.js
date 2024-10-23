"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchemaPost = exports.createPostSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Schema for validating the creation of a new post
exports.createPostSchema = joi_1.default.object({
    caption: joi_1.default.string().min(1).max(255).required()
        .messages({
        'string.base': 'Caption must be a string.',
        'string.empty': 'Caption cannot be empty.',
        'string.min': 'Caption must be at least 1 character long.',
        'string.max': 'Caption must be less than or equal to 255 characters.',
        'any.required': 'Caption is required.',
    }),
    is_public: joi_1.default.boolean().optional()
        .messages({
        'boolean.base': 'Is_public must be a boolean.',
    }),
    location: joi_1.default.string().optional().allow(null).max(255)
        .messages({
        'string.base': 'Location must be a string.',
        'string.max': 'Location must be less than or equal to 255 characters.',
    })
});
exports.idSchemaPost = joi_1.default.object({
    id: joi_1.default.string().required()
        .messages({
        "string.base": "Post ID must be a string",
        "string.empty": "Post ID is required",
        "any.required": "Post ID is required",
    })
});
