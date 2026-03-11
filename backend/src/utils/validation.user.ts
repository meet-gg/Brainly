import { link } from "node:fs";
import z from "zod";

export const SignUpValidation = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignUpType = z.infer<typeof SignUpValidation>;

export const loginValidation = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type loginType = z.infer<typeof loginValidation>;


export const ContentValidation = z.object({
    link: z.url("Invalid URL format"),
    // type: z.enum(["YOUTUBE", "TWITTER"], "Type must be either 'YOUTUBE', 'TWITTER'"),
    type: z.string(),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export type ContentType = z.infer<typeof ContentValidation>;

export const ContentUpdateValidation = z.object({
    link: z.url("Invalid URL format").optional(),
    // type: z.enum(["YOUTUBE", "TWITTER"], "Type must be either 'YOUTUBE', 'TWITTER'").optional(),
    type: z.string().optional(),
    tags: z.array(z.string()).min(1, "At least one tag is required").optional(),
});

export type ContentUpdateType = z.infer<typeof ContentUpdateValidation>;