"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authRoute = express_1.default.Router()
    .post("/signup", auth_controller_1.registerUser)
    .post("/signin", auth_controller_1.loginUser);
exports.default = authRoute;
