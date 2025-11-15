import {z} from "zod";
export const registerSchema = z.object({
  username: z.string().min(1).max(255).regex(/^[a-zA-Z0-9]+$/),
  password: z.string().min(6),
  fullName: z.string().min(1).max(255),
});
