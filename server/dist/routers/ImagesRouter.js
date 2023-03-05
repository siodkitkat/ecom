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
exports.deleteImageFromDb = void 0;
const express_1 = require("express");
const client_s3_1 = require("@aws-sdk/client-s3");
const types_1 = require("../types");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utils");
const multer_s3_1 = __importDefault(require("multer-s3"));
const Image_1 = __importDefault(require("../models/Image"));
const env = types_1.envSchema.parse(process.env);
const deleteImageFromDb = ({ image }) => __awaiter(void 0, void 0, void 0, function* () {
    let deleted = false;
    let err;
    try {
        const { $metadata: reqStatus } = yield utils_1.S3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: image.key,
        }));
        if (reqStatus.httpStatusCode) {
            if (reqStatus.httpStatusCode < 200 || reqStatus.httpStatusCode > 299) {
                err = new Error("Failed to delete from R2 storage.");
            }
            else {
                yield image.remove();
                deleted = true;
            }
        }
    }
    catch (e) {
        err = e;
    }
    return {
        deleted: deleted,
        deletedImage: image,
        error: err,
    };
});
exports.deleteImageFromDb = deleteImageFromDb;
const authedToEdit = ({ itemId, user }) => __awaiter(void 0, void 0, void 0, function* () {
    let canEdit = false;
    let error, img;
    if (!itemId) {
        error = {
            message: "Missing image id in the request body.",
            statusCode: 400,
        };
    }
    else {
        try {
            img = yield Image_1.default.findById(itemId);
        }
        catch (e) {
            //
        }
    }
    if (!img) {
        error = {
            message: "Invalid image id provided. No such image exists.",
            statusCode: 404,
        };
    }
    else if (!user) {
        error = {
            message: "You must be logged in to do this.",
            statusCode: 401,
        };
    }
    else if (!img.user._id.equals(user._id)) {
        error = {
            message: "You are not authed to do that.",
            statusCode: 401,
        };
    }
    else {
        canEdit = true;
    }
    return {
        canEdit: canEdit,
        img: img,
        user: user,
        error: error,
    };
});
const imageStorage = (0, multer_s3_1.default)({
    s3: utils_1.S3,
    bucket: env.R2_BUCKET_NAME,
    metadata: (req, file, cb) => {
        return cb(null, { fieldName: file.fieldname });
    },
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    cacheControl: "max-age=31536000",
    key: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 100)}`);
    },
});
const uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.toLowerCase().startsWith("image")) {
            return cb(null, false);
        }
        return cb(null, true);
    },
});
const ImagesRouter = (0, express_1.Router)();
ImagesRouter.post("/", middlewares_1.requireLogin, uploadImage.single("image"), (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json((0, utils_1.errorResponse)("Only image files are allowed.", 400));
    }
    const user = req.user;
    const publicUrl = `${env.R2_PUBLIC_URL}/${req.file.key}`;
    const image = new Image_1.default({ key: req.file.key, publicUrl: publicUrl, user: user._id });
    yield image.save();
    return res.status(200).json({
        message: "Successfully uploaded the requested image.",
        image: image,
    });
})));
ImagesRouter.delete("/", middlewares_1.requireLogin, (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { canEdit, error, img } = yield authedToEdit({ itemId: req.body.id, user: req.user });
    if (!canEdit) {
        return res.status(error.statusCode).json((0, utils_1.errorResponse)(error.message, error.statusCode));
    }
    const { deleted, deletedImage } = yield (0, exports.deleteImageFromDb)({
        image: img,
    });
    if (!deleted) {
        return res.status(500).json((0, utils_1.errorResponse)("Failed to delete the requested image", 500));
    }
    return res.status(200).json({
        message: "Successfully deleted the requested image.",
        deletedImage: deletedImage,
    });
})));
ImagesRouter.post("/", middlewares_1.requireLogin, uploadImage.single("image"), (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json((0, utils_1.errorResponse)("Only image files are allowed.", 400));
    }
    const user = req.user;
    const publicUrl = `${env.R2_PUBLIC_URL}/${req.file.key}`;
    const image = new Image_1.default({ key: req.file.key, publicUrl: publicUrl, user: user._id });
    yield image.save();
    return res.status(200).json({
        message: "Successfully uploaded the requested image.",
        image: image,
    });
})));
exports.default = ImagesRouter;
