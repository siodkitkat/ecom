import mongoose, { Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
}

const User = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

User.plugin(passportLocalMongoose);

export default mongoose.model<IUser>("User", User);
