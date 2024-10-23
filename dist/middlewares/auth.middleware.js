"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET;
const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).json({
            status: false,
            message: 'Invalid token'
        });
    }
    const token = authorization.split(' ')[1];
    jsonwebtoken_1.default.verify(token, SECRET_KEY, { algorithms: ['HS512'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized!',
                data: null
            });
        }
        req.user = decoded;
        next(); // Call next to continue to the next middleware
    });
};
exports.verifyToken = verifyToken;
