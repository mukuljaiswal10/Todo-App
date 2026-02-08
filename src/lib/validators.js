import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name too short").max(80),
    email: z.string().email("Invalid email"),
    password: z
        .string()
        .min(8, "Min 8 chars")
        .max(72, "Too long")
        .regex(/[A-Z]/, "Add 1 uppercase")
        .regex(/[0-9]/, "Add 1 number")
        .regex(/[^A-Za-z0-9]/, "Add 1 special char"),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(10),
    password: z
        .string()
        .min(8)
        .max(72)
        .regex(/[A-Z]/)
        .regex(/[0-9]/)
        .regex(/[^A-Za-z0-9]/),
});
export const todoCreateSchema = z.object({
    title: z.string().min(1).max(160),
    description: z.string().max(5000).optional().default(""),
    status: z.enum(["todo", "doing", "done"]).optional().default("todo"),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional().default("medium"),
    tags: z.array(z.string().max(30)).optional().default([]),
    dueAt: z.string().datetime().optional().nullable(),
    reminderAt: z.string().datetime().optional().nullable(),
    subtasks: z
        .array(z.object({ title: z.string().min(1).max(120), done: z.boolean().optional().default(false) }))
        .optional()
        .default([]),
});

export const todoUpdateSchema = todoCreateSchema.partial();