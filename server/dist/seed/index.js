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
const mongoose_1 = __importDefault(require("mongoose"));
const Image_1 = __importDefault(require("../models/Image"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const ImagesRouter_1 = require("../routers/ImagesRouter");
const utils_1 = require("../utils");
const util_1 = require("./util");
const falso_1 = require("@ngneat/falso");
const getRandomProductDesc = () => {
    let desc = (0, falso_1.randProductDescription)() + " ";
    for (let i = 0; i < 5; i++) {
        desc += (0, falso_1.randProductDescription)() + " ";
    }
    return desc.trim();
};
const SEED_ADMIN = {
    username: utils_1.env.SEED_USERNAME,
    password: utils_1.env.SEED_PASSWORD,
};
const seedDb = (seeder) => __awaiter(void 0, void 0, void 0, function* () {
    // Remove all existing products and images first
    const products = yield Product_1.default.find({}).populate("image").populate("User");
    for (let product of products) {
        for (let _image of product.image) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let image = _image;
            try {
                if (image.publicUrl.startsWith(utils_1.env.R2_PUBLIC_URL)) {
                    yield (0, ImagesRouter_1.deleteImageFromDb)({ image: image });
                }
                else {
                    yield image.remove();
                }
            }
            catch (e) {
                console.error("Failed to remove an image");
            }
        }
        yield product.delete();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let user = product.User;
        user.products = user.products.filter((userProduct) => !userProduct.equals(product._id));
        yield user.save();
    }
    // ^ Remove all existing products and images first
    const randomItems = util_1.seedProducts.map((product) => {
        return Object.assign(Object.assign({}, product), { description: getRandomProductDesc() });
    });
    let done = 0;
    for (let item of randomItems) {
        try {
            let image = new Image_1.default({ publicUrl: item.image, key: item.image, user: seeder });
            yield image.save();
            let product = new Product_1.default({
                title: item.title,
                price: Math.round(Math.random() * 10000),
                body: item.description,
                image: [image._id],
                quantity: Math.round(Math.random() * 100),
                User: seeder._id,
            });
            yield product.save();
            seeder.products.push(product._id);
            yield seeder.save();
            done++;
        }
        catch (e) {
            continue;
        }
    }
    console.log(`Generated ${done}/${randomItems.length} fake products.`);
    process.exit();
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(utils_1.env.DB_URL);
    }
    catch (e) {
        throw new Error("Couldn't connect to mongodb.");
    }
    console.log("Loaded image model ", Image_1.default);
    console.log("Loaded user model ", User_1.default);
    const seedUser = yield User_1.default.findOne({
        username: SEED_ADMIN.username,
    });
    if (!seedUser) {
        const newUser = new User_1.default(SEED_ADMIN);
        User_1.default.register(newUser, SEED_ADMIN.password, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error("Failed to create seed products owner");
            }
            yield seedDb(newUser);
        }));
    }
    else {
        yield seedDb(seedUser);
    }
}))();
