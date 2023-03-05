import "express-session";
import { IUser } from "../models/User";

declare module "express-session" {
  interface SessionData {
    passport?: IUser;
  }
}

declare namespace Express {
  export interface Request {
    user?: IUser;
  }
}
