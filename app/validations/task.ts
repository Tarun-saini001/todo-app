import { z } from "zod";

export const taskSchema = z.object({
    title: z.string()
        .trim()
        .nonempty("Title is required")
        .min(2, "Title must be at least 2 characters")
        .max(15, "Title must be at most 15 characters")
        .regex(/^[A-Z]/, "Title must start with a capital letter"),
        // .regex(/^[A-Za-z0-9\s]*$/, "Title must contain only letters and numbers"),

    date: z.string().min(1, "Date is required"),

    priority: z.enum(["Extreme", "Moderate", "Low"]).default("Moderate"),

    description: z.string()
        .trim()
        .nonempty("Description is required")
        .min(20, "Description must be at least 20 characters")
        .max(250, "Description must be at most 100 characters"),
    image: z
        .any()
        .refine(
            (file) => {

                if (typeof file === "string") return true;


                if (file && typeof file === "object") {
                    return "type" in file && "size" in file;
                }

                return false;
            },
            "Please upload an image"
        )
        .refine(
            (file) => {
                if (typeof file === "string") return true;

                if (file && typeof file === "object" && "type" in file) {
                    return ["image/jpeg", "image/jpg", "image/png", "image/webp"]
                        .includes((file as any).type);
                }

                return false;
            },
            "Only images are allowed"
        )

});




