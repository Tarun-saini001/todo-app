import { z } from "zod";

export const taskSchema = z.object({
    title: z.string()
        .trim()
        .nonempty("Title is required")
        .min(2, "Title must be at least 2 characters")
        .regex(/^[A-Z]/, "Title must start with a capital letter")
        .regex(/^[A-Za-z\s]*$/, "Title must contain only letters"),

    date: z.string().min(1, "Date is required"),

    priority: z.enum(["Extreme", "Moderate", "Low"]).default("Moderate"),

    description: z.string()
        .trim()
        .nonempty("Description is required")
        .min(20, "Description must be at least 20 characters")
        .regex(/^[A-Z]/, "Description must start with a capital letter")
        .regex(/^[A-Za-z\s]*$/, "Description must contain only letters"),

    image: z
        .any()
        .refine((file) => file instanceof File || typeof file === "string",
            "Please upload an image")
        .refine(
            (file) => {
                if (typeof file === "string") return true;
                if (file instanceof File) {
                    return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
                }
                return false;
            },
            "Only images are allowed"
        )

});