import { Handler } from "express";
import { errorResponse } from "../utils";

export const requireLogin: Handler = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(errorResponse("You must be logged in to do this.", 401));
  }

  return next();
};

export const requireLoggedOut: Handler = (req, res, next) => {
  if (req.user !== undefined) {
    return res.status(401).json(errorResponse("You must be logged out to do this.", 401));
  }

  return next();
};
