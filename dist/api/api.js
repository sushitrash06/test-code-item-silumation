"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const post_route_1 = __importDefault(require("../routes/post.route"));
const api = (0, express_1.Router)()
    .use("/auth", auth_route_1.default)
    .use("/post", post_route_1.default);
exports.default = api;
