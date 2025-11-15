import {z} from "zod";

export const createDomainSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  connected: z.boolean(),
  isPublic: z.boolean(),
})
export const updateDomainSchema = z.object({
  description: z.string().optional(),
  isPublic: z.boolean(),
})

export type CreateDomainDto = z.infer<typeof createDomainSchema>;
export type UpdateDomainDto = z.infer<typeof updateDomainSchema>;
