import mongoose, { Schema, Types } from "mongoose";

export interface IImage {
  publicUrl: string;
  key: string;
  user: Types.ObjectId;
}

const ImageSchema = new mongoose.Schema<IImage>({
  publicUrl: { type: String, required: true },
  key: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model<IImage>("Image", ImageSchema);
