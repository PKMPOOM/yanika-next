import { z } from "zod";

const systemRoles = z.enum(["user", "admin"]);
export type systemRoles = z.infer<typeof systemRoles>;

const navMenuSchema = z.object({
  name: z.string(),
  id: z.string(),
  href: z.string(),
  role: z.array(systemRoles),
});

export type navMenuTypes = z.infer<typeof navMenuSchema>;
