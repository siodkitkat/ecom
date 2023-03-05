import mongoose, { Schema, Types, Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  products: Types.ObjectId[];
}

const User = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
});

User.plugin(passportLocalMongoose);

export default mongoose.model<IUser>("User", User);
