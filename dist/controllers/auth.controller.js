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
exports.loginUser = exports.registerUser = void 0;
const auth_validate_1 = require("../validation/auth.validate");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_lib_1 = __importDefault(require("../libs/prisma.lib"));
const error_1 = require("../errors/error");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = auth_validate_1.userRegister.validate(req.body);
        if (error) {
            throw new error_1.ErrorWithStatusCode(error.details[0].message, 400);
        }
        const { username, email, password } = req.body;
        const hashedPassword = yield argon2_1.default.hash(password);
        const user = yield prisma_lib_1.default.users.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                updated_at: new Date(),
            },
        });
        yield prisma_lib_1.default.database_history.create({ data: {
                user_id: user.id,
                detail: 'new user',
                type: 'REGISTRATION'
            } });
        res.status(201).json({
            status: true,
            message: 'User created successfully',
            data: null,
        });
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = auth_validate_1.userLogin.validate(req.body);
        if (error) {
            throw new error_1.ErrorWithStatusCode(error.details[0].message, 400);
        }
        const { username, email, password } = req.body;
        if ((username && email) || (!username && !email)) {
            throw new error_1.ErrorWithStatusCode('Please provide either username or email, but not both.', 400);
        }
        const user = yield prisma_lib_1.default.users.findUnique({
            where: {
                username: username || undefined,
                email: email || undefined,
            },
        });
        if (!user) {
            throw new error_1.ErrorWithStatusCode("User is not found", 404);
        }
        const isPasswordValid = yield argon2_1.default.verify(user.password, password);
        if (!isPasswordValid) {
            res.status(401).json({
                status: false,
                message: 'Invalid password.',
                data: null,
            });
            ;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
        }, process.env.JWT_SECRET, { algorithm: 'HS512', expiresIn: '1h' });
        res.status(200).json({
            status: true,
            message: 'Login successful.',
            data: {
                token: token,
            },
        });
    }
    catch (err) {
        (0, error_1.handleError)(err, res);
    }
});
exports.loginUser = loginUser;
