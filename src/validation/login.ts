import { z } from "zod";

export const LoginSchema = z.object({
    username: z.string().min(1, "Username is required").max(100),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must have than 8 characters"),
});
