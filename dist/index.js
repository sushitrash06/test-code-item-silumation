"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./api/api"));
const fs = __importStar(require("fs"));
const YAML = __importStar(require("yaml"));
const path = __importStar(require("path"));
const swaggerUI = __importStar(require("swagger-ui-express"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./errors/error");
require('dotenv').config();
const PORT = process.env.PORT;
const ENV = process.env.env;
const filePath = path.join(__dirname, 'api-docs.yaml');
let swaggerDocument;
try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    swaggerDocument = YAML.parse(fileContent);
}
catch (error) {
    process.exit(1);
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use("/style.css", express_1.default.static(path.join(__dirname, "./style.css")));
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
    customCssUrl: "/style.css",
}));
app.use("/api/v1", api_1.default);
app.use((err, req, res, next) => {
    (0, error_1.handleError)(err, res);
});
//404
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: `are you lost? ${req.method} ${req.url} is not registered!`,
        data: null,
    });
});
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});
exports.default = app;
