import { z } from "zod";

export const ImageSchema = z.object({
  _id: z.string(),
  publicUrl: z.string(),
  key: z.string(),
});

export const ProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  price: z.number().positive(),
  quantity: z.number().nonnegative(),
  body: z.string(),
  image: z.array(ImageSchema),
  User: z.string(),
});

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  products: z.array(z.string()),
});

export type User = z.infer<typeof UserSchema>;
