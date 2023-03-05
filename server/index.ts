import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bodyParser from "body-parser";
import MongoDbStoreFactory from "connect-mongodb-session";
import mongoose from "mongoose";
import User from "./models/User";
import { errorResponse } from "./utils";
import { envSchema } from "./types";
import { requireLoggedOut, requireLogin } from "./middlewares";

const env = envSchema.parse(process.env);

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
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.user = req.session.passport;

  next();
});

app.get("/", (req, res) => {
  return res.status(200).json("Nothing to see here");
});

app.get("/me", requireLogin, (req, res) => {
  return res.status(200).json(req.user);
});

app.post("/register", requireLoggedOut, (req, res) => {
  const newUser = new User({ username: req.body.username });

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
});

app.post("/logout", requireLogin, (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json(errorResponse("Something went wrong while logging out the user.", 500));
    }
    return res.status(200).json({
      message: "Successfully logged out.",
    });
  });
});

app.post("/login", requireLoggedOut, passport.authenticate("local"), (req, res) => {
  if (!req.user) {
    return res.status(400).json(errorResponse("Invalid email id or password.", 400));
  }

  return res.status(200).json({
    message: "Successfully logged in.",
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
