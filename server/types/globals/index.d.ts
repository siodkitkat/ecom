import "express-session";
import { IUser } from "../../models/User";

declare module "express-session" {
  interface SessionData {
    passport?: {
      user: IUser;
    };
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
    file?: Express.MulterS3.File;
  }
}
