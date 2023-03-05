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
exports.catchAsync = exports.S3 = exports.stringToNum = exports.errorResponse = exports.env = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const types_1 = require("../types");
dotenv_1.default.config();
exports.env = types_1.envSchema.parse(process.env);
const errorResponse = (message, error) => {
    return {
        message,
        error,
    };
};
exports.errorResponse = errorResponse;
const stringToNum = (input, type = "int", fallback = 0) => {
    const num = type === "float" ? parseFloat(input) : parseInt(input);
    return isNaN(num) ? fallback : isNaN;
};
exports.stringToNum = stringToNum;
exports.S3 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: `https://${exports.env.CLOUDFLARE_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: exports.env.R2_ACCESS_ID,
        secretAccessKey: exports.env.R2_SECRET_KEY,
    },
});
const catchAsync = (handler) => {
    const safeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handler(req, res, next);
        }
        catch (e) {
            next(e);
        }
    });
    return safeHandler;
};
exports.catchAsync = catchAsync;
