import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
});

export type User = z.infer<typeof UserSchema>;
