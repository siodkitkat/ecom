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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const body_parser_1 = __importDefault(require("body-parser"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const utils_1 = require("./utils");
const middlewares_1 = require("./middlewares");
const ImagesRouter_1 = __importStar(require("./routers/ImagesRouter"));
const Product_1 = __importDefault(require("./models/Product"));
const authedToEditProduct = ({ user, productId }) => __awaiter(void 0, void 0, void 0, function* () {
    let error;
    let product;
    if (!(user === null || user === void 0 ? void 0 : user._id)) {
        error = { message: "You must be logged in to do this.", code: 400 };
    }
    else if (!productId) {
        error = { message: "Missing product id in url params.", code: 400 };
    }
    else {
        try {
            product = yield Product_1.default.findById(productId).populate("User").populate("image");
            if (!product) {
                error = { message: "Invalid product id. No product with that id exists", code: 404 };
            }
            else if (!product.User._id.equals(user._id)) {
                error = { message: "You are not authorized to change this product.", code: 401 };
            }
        }
        catch (e) {
            error = {
                message: "Failed to find the requested product. Please make sure the given id is a valid id.",
                code: 500,
            };
        }
    }
    return {
        error: error,
        product: product,
    };
});
mongoose_1.default.connect(utils_1.env.DB_URL).catch((err) => {
    console.error(`Failed to start mongodb: ${err}`);
});
const MongoDbStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const app = (0, express_1.default)();
const PORT = 5000;
const sessionStore = new MongoDbStore({
    uri: utils_1.env.DB_URL,
    collection: "sessions",
});
sessionStore.on("error", (err) => {
    console.error("Err connecting to session db", err);
});
app.use((0, express_session_1.default)({
    secret: utils_1.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
}));
app.use(passport_1.default.initialize());
//To do fix this any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.serializeUser((user, cb) => {
    cb(null, { _id: user._id, username: user.username });
});
passport_1.default.deserializeUser(User_1.default.deserializeUser());
passport_1.default.use(new passport_local_1.Strategy(User_1.default.authenticate()));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    var _a;
    req.user = (_a = req.session.passport) === null || _a === void 0 ? void 0 : _a.user;
    next();
});
app.get("/", (req, res) => {
    return res.status(200).json("Nothing to see here");
});
app.get("/me", middlewares_1.requireLogin, (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (!user) {
        return res.status(401).json((0, utils_1.errorResponse)("You must be logged in to do this", 401));
    }
    return res.status(200).json({
        _id: user._id,
        username: user.username,
        products: user.products,
    });
})));
app.post("/register", middlewares_1.requireLoggedOut, (0, utils_1.catchAsync)((req, res) => {
    const newUser = new User_1.default({ username: req.body.username, password: req.body.password });
    User_1.default.register(newUser, req.body.password, (err) => {
        if (err) {
            return res.status(500).json((0, utils_1.errorResponse)("Something went wrong while registering the user.", 500));
        }
        passport_1.default.authenticate("local")(req, res, () => {
            return res.status(200).json({
                message: "Successfully registered.",
            });
        });
    });
}));
app.post("/logout", middlewares_1.requireLogin, (0, utils_1.catchAsync)((req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json((0, utils_1.errorResponse)("Something went wrong while logging out the user.", 500));
        }
        return res.status(200).json({
            message: "Successfully logged out.",
        });
    });
}));
app.post("/login", middlewares_1.requireLoggedOut, passport_1.default.authenticate("local"), (0, utils_1.catchAsync)((req, res) => {
    if (!req.user) {
        return res.status(400).json((0, utils_1.errorResponse)("Invalid email id or password.", 400));
    }
    return res.status(200).json({
        message: "Successfully logged in.",
    });
}));
app.get("/products", (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find({}).populate("image");
    return res.status(200).json({ message: "Successfully got all the products.", products: products });
})));
app.post("/products", middlewares_1.requireLogin, (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b._id)) {
        return res.status(401).json((0, utils_1.errorResponse)("You must be logged in to do this.", 401));
    }
    const user = yield User_1.default.findById(req.user._id);
    if (!user) {
        return res.status(401).json((0, utils_1.errorResponse)("You must be logged in to do this.", 401));
    }
    const { title, price, quantity, body, imageId, } = req.body;
    const images = [];
    if (imageId) {
        images.push(imageId);
    }
    const product = new Product_1.default({
        body,
        title,
        price: parseInt(price),
        quantity: parseInt(quantity),
        User: req.user._id,
        image: images,
    });
    yield product.save();
    user.products.push(product._id);
    yield user.save();
    return res.status(200).json({ message: "Successfully created the requested product", product: product });
})));
app.get("/products/:id", (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json((0, utils_1.errorResponse)("Missing product id in url params.", 400));
    }
    const product = yield Product_1.default.findById(id).populate("image");
    if (!product) {
        return res.status(404).json((0, utils_1.errorResponse)("Invalid product id. No product with that id exists", 404));
    }
    return res.status(200).json({
        message: "Successfully got the requested product.",
        product: product,
    });
})));
app.patch("/products/:id", middlewares_1.requireLogin, (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product, error } = yield authedToEditProduct({
        user: req.user,
        productId: req.params.id,
    });
    if (error) {
        return res.status(error.code).json((0, utils_1.errorResponse)(error.message, error.code));
    }
    const { title, price, quantity, body } = req.body;
    if (title) {
        product.title = title;
    }
    if (price) {
        product.price = price;
    }
    if (quantity) {
        product.quantity = quantity;
    }
    if (body) {
        product.body = body;
    }
    yield product.save();
    res.status(200).json({ message: "Successfully updated the requested product.", product: product });
})));
app.delete("/products/:id", middlewares_1.requireLogin, (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { product, error } = yield authedToEditProduct({
        user: req.user,
        productId: req.params.id,
    });
    if (error) {
        return res.status(error.code).json((0, utils_1.errorResponse)(error.message, error.code));
    }
    const user = yield User_1.default.findById((_c = req.user) === null || _c === void 0 ? void 0 : _c._id);
    if (!user) {
        return res.status(401).json((0, utils_1.errorResponse)("You must be logged in to do this.", 401));
    }
    for (let image of product.image) {
        yield (0, ImagesRouter_1.deleteImageFromDb)({ image: image });
    }
    yield product.delete();
    user.products = user.products.filter((userProduct) => !userProduct._id.equals(product._id));
    yield user.save();
    res.status(200).json({ message: "Successfully deleted the requested product.", product: product });
})));
app.use("/images", ImagesRouter_1.default);
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
