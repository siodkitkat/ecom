"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLoggedOut = exports.requireLogin = void 0;
const utils_1 = require("../utils");
const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json((0, utils_1.errorResponse)("You must be logged in to do this.", 401));
    }
    return next();
};
exports.requireLogin = requireLogin;
const requireLoggedOut = (req, res, next) => {
    if (req.user !== undefined) {
        return res.status(401).json((0, utils_1.errorResponse)("You must be logged out to do this.", 401));
    }
    return next();
};
exports.requireLoggedOut = requireLoggedOut;
