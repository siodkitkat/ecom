import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bodyParser from "body-parser";
import MongoDbStoreFactory from "connect-mongodb-session";
import mongoose from "mongoose";
import User, { IUser } from "./models/User";
import { catchAsync, env, errorResponse } from "./utils";
import { requireLoggedOut, requireLogin } from "./middlewares";
import ImagesRouter, { deleteImageFromDb } from "./routers/ImagesRouter";
import Product from "./models/Product";
import { IImage } from "./models/Image";

const authedToEditProduct = async ({ user, productId }: { user?: IUser; productId?: string }) => {
  let error: { message: string; code: number } | undefined;
  let product;

  if (!user?._id) {
    error = { message: "You must be logged in to do this.", code: 400 };
  } else if (!productId) {
    error = { message: "Missing product id in url params.", code: 400 };
  } else {
    try {
      product = await Product.findById(productId).populate("User").populate("image");

      if (!product) {
        error = { message: "Invalid product id. No product with that id exists", code: 404 };
      } else if (!product.User._id.equals(user._id)) {
        error = { message: "You are not authorized to change this product.", code: 401 };
      }
    } catch (e) {
      error = {
        message: "Failed to find the requested product. Please make sure the given id is a valid id.",
        code: 500,
      };
    }
  }

  return {
    error: error,
    product: product,
  } as
    | {
        error: undefined;
        product: Exclude<typeof product, undefined | null> & {
          image: Array<IImage>;
        };
      }
    | {
        error: Exclude<typeof error, undefined>;
        product: undefined;
      };
};

mongoose.connect(env.DB_URL).catch((err) => {
  console.error(`Failed to start mongodb: ${err}`);
});

const MongoDbStore = MongoDbStoreFactory(session);

const app = express();
const PORT = 5000;

const sessionStore = new MongoDbStore({
  uri: env.DB_URL,
  collection: "sessions",
});

sessionStore.on("error", (err) => {
  console.error("Err connecting to session db", err);
});

app.use(
  session({
    secret: env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(passport.initialize());

//To do fix this any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, cb) => {
  cb(null, { _id: user._id, username: user.username });
});
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = req.session.passport?.user;

  next();
});

app.get("/", (req, res) => {
  return res.status(200).json("Nothing to see here");
});

app.get(
  "/me",
  requireLogin,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(401).json(errorResponse("You must be logged in to do this", 401));
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      products: user.products,
    });
  })
);

app.post(
  "/register",
  requireLoggedOut,
  catchAsync((req, res) => {
    const newUser = new User({ username: req.body.username, password: req.body.password });

    User.register(newUser, req.body.password, (err) => {
      if (err) {
        return res.status(500).json(errorResponse("Something went wrong while registering the user.", 500));
      }

      passport.authenticate("local")(req, res, () => {
        return res.status(200).json({
          message: "Successfully registered.",
        });
      });
    });
  })
);

app.post(
  "/logout",
  requireLogin,
  catchAsync((req, res) => {
    req.logout(function (err) {
      if (err) {
        return res.status(500).json(errorResponse("Something went wrong while logging out the user.", 500));
      }
      return res.status(200).json({
        message: "Successfully logged out.",
      });
    });
  })
);

app.post(
  "/login",
  requireLoggedOut,
  passport.authenticate("local"),
  catchAsync((req, res) => {
    if (!req.user) {
      return res.status(400).json(errorResponse("Invalid email id or password.", 400));
    }

    return res.status(200).json({
      message: "Successfully logged in.",
    });
  })
);

app.get(
  "/products",
  catchAsync(async (req, res) => {
    const products = await Product.find({}).populate("image");
    return res.status(200).json({ message: "Successfully got all the products.", products: products });
  })
);

app.post(
  "/products",
  requireLogin,
  catchAsync(async (req, res) => {
    if (!req.user?._id) {
      return res.status(401).json(errorResponse("You must be logged in to do this.", 401));
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json(errorResponse("You must be logged in to do this.", 401));
    }

    const {
      title,
      price,
      quantity,
      body,
      imageId,
    }: {
      title?: string;
      price?: string;
      quantity?: string;
      body?: string;
      imageId?: string;
    } = req.body;

    const images: Array<string> = [];

    if (imageId) {
      images.push(imageId);
    }

    const product = new Product({
      body,
      title,
      price: parseInt(price as string),
      quantity: parseInt(quantity as string),
      User: req.user._id,
      image: images,
    });
    await product.save();

    user.products.push(product._id);
    await user.save();

    return res.status(200).json({ message: "Successfully created the requested product", product: product });
  })
);

app.get(
  "/products/:id",
  catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json(errorResponse("Missing product id in url params.", 400));
    }

    const product = await Product.findById(id).populate("image");

    if (!product) {
      return res.status(404).json(errorResponse("Invalid product id. No product with that id exists", 404));
    }

    return res.status(200).json({
      message: "Successfully got the requested product.",
      product: product,
    });
  })
);

app.patch(
  "/products/:id",
  requireLogin,
  catchAsync(async (req, res) => {
    const { product, error } = await authedToEditProduct({
      user: req.user,
      productId: req.params.id,
    });

    if (error) {
      return res.status(error.code).json(errorResponse(error.message, error.code));
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

    await product.save();

    res.status(200).json({ message: "Successfully updated the requested product.", product: product });
  })
);

app.delete(
  "/products/:id",
  requireLogin,
  catchAsync(async (req, res) => {
    const { product, error } = await authedToEditProduct({
      user: req.user,
      productId: req.params.id,
    });

    if (error) {
      return res.status(error.code).json(errorResponse(error.message, error.code));
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(401).json(errorResponse("You must be logged in to do this.", 401));
    }

    for (let image of product.image) {
      await deleteImageFromDb({ image: image });
    }

    await product.delete();

    user.products = user.products.filter((userProduct) => !userProduct._id.equals(product._id));
    await user.save();

    res.status(200).json({ message: "Successfully deleted the requested product.", product: product });
  })
);

app.use("/images", ImagesRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
