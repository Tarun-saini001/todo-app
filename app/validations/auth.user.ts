import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string()
        .trim()
        .nonempty("First name is required")
        .min(2, "Name must be at least 2 characters")
        .regex(/^[A-Z]/, "Name must start with a capital letter")
        .regex(/^[A-Za-z\s]*$/, "Name must contain only letters"),

    lastName: z.string()
        .trim()
        .nonempty("Last name is required")
        .min(2, "Name must be at least 2 characters")
        .regex(/^[A-Z]/, "Name must start with a capital letter")
        .regex(/^[A-Za-z\s]*$/, "Name must contain only letters"),

    userName: z.string()
        .trim()
        .nonempty("User name is required")
        .min(3, "Name must be at least 3 characters")
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
            "Username must contain at least one letter, one number, and one special character"
        ),
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .trim()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    confirmPassword: z.string().trim().nonempty("Confirm password is required"),

}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    usearNamea: z
        .string()
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"),
    password: z.string().nonempty("Password is required"),
});