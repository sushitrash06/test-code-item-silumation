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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.ErrorWithStatusCode = void 0;
const library_1 = require("@prisma/client/runtime/library");
const ENV = process.env.PORT;
class ErrorWithStatusCode extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ErrorWithStatusCode.prototype);
    }
}
exports.ErrorWithStatusCode = ErrorWithStatusCode;
const handleError = (err, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (err instanceof ErrorWithStatusCode) {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message,
            data: null,
        });
    }
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({
                    status: false,
                    message: `${(_a = err.meta) === null || _a === void 0 ? void 0 : _a.target} already used`,
                    data: null,
                });
        }
    }
    return res.status(500).json({
        status: false,
        message: ENV === 'production' ? 'Internal Server Error' : err.message,
        data: null,
    });
});
exports.handleError = handleError;
