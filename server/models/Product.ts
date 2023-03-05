import mongoose, { Schema, Types } from "mongoose";

export interface IProduct {
  title: string;
  price: number;
  quantity: number;
  body: string;
  image: string[];
  User: Types.ObjectId;
}

const Product = new mongoose.Schema<IProduct>({
  title: String,
  price: Number,
  quantity: Number,
  body: String,
  image: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
      default: [],
    },
  ],
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model<IProduct>("Product", Product);
