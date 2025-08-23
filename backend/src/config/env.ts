import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000), // coerce basically converts the value to a number
  DB_URL: z.string().min(1, "Database URL is required"),
  JWT_SECRET: z.string().min(1, "JWT secret is required"),
});

export const env = envSchema.parse(process.env);
