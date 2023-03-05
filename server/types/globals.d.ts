import "express-session";

type RequestUser = { user: string };

declare module "express-session" {
  interface SessionData {
    passport?: RequestUser;
  }
}

declare namespace Express {
  export interface Request {
    user?: RequestUser;
  }
}
