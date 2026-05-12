"use server"

import bcrypt from "bcryptjs"
import { User } from "@/app/lib/models/user"
import connectDB from "../lib/db"
import { forgotPasswordSchema, imageSchema, loginSchema, profileSchema, registerSchema, resetPasswordSchema } from "../validations/auth.user";
import { messages } from "../constants/messages";
import { generateAccessToken, generateRefreshToken } from "../lib/utils";
import RefreshTokenModel from "../lib/models/token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "../lib/auth";
import cloudinary from "../lib/cloudnary";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { PasswordReset } from "@/app/lib/models/passwordReset";
import { transporter } from "../lib/mail";

export async function registerUser(prevState: any, formData: FormData) {

    const validateFields = registerSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        userName: formData.get('userName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    })
    console.log('validateFields: ', validateFields);
    if (!validateFields.success) {
        return {
            success: false,
            errors: validateFields.error.flatten().fieldErrors,
            message: ""
        };
    }
    const { firstName, lastName, userName, email, password } = validateFields.data;
    try {
        await connectDB();
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return {
                success: false,
                errors: {},
                message: messages.EMAIL_EXISTS,
            };
        }

        const userNameExists = await User.findOne({ userName });
        if (userNameExists) {
            return {
                success: false,
                errors: {},
                message: messages.USER_NAME_EXISTS,
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });

    } catch (error) {
        console.log('Fialed to register: ', error);
        return {
            success: false,
            errors: {},
            message: messages.SOMETHNG_WENT_WRONG,
        };
    }

    return {
        success: true,
        errors: {},
        message: "",
    };
}


export async function loginUser(prevState: any, formData: FormData) {
    const data = {
        userName: formData.get("userName"),
        password: formData.get("password"),
    };

    const result = loginSchema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            message: "",
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { userName, password } = result.data;


    try {
        await connectDB();

        const user = await User.findOne({ userName });

        if (!user) {
            return {
                success: false,
                message: messages.USER_NOT_FOUND,
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                success: false,
                message: messages.INVALID_CREDENTALS
            };
        }

        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());


        await RefreshTokenModel.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });


        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 60 * 15,
            path: "/",
            secure: false,
            sameSite: "lax",
        });

        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            secure: false,
            sameSite: "lax",
        });

        // redirect("/")
        return {
            success: true,
            message: messages.LOGIN_SUCCESSFUL,
        };
    } catch (error) {
        console.log("Login error:", error);
        return {
            success: false,
            message: messages.SOMETHNG_WENT_WRONG,
        };
    }
}


// export async function logoutUser() {
//     console.log("inside logout action");
//     const cookieStore = await cookies();

//     cookieStore.delete("accessToken");
//     cookieStore.delete("refreshToken");
//     console.log('cookieStore: after logout action', cookieStore);
//     redirect("/sign-in");
//     // return { success: true, message: messages.LOGOUT_SUCCESSFULLY };
// }


export async function logoutUser() {

    const cookieStore = await cookies();

    const refreshToken =
        cookieStore.get("refreshToken")?.value;

    await connectDB();

    if (refreshToken) {
        await RefreshTokenModel.deleteOne({
            refreshToken,
        });
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    redirect("/sign-in");
}




export async function updateProfile(formData: FormData) {
    try {
        await connectDB();

        const currentUser = await getUser();

        if (!currentUser) {
            return {
                success: false,
                message: messages.UNAUTHERISED,
            };
        }

        const data = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            userName: formData.get("userName"),
            email: formData.get("email"),
        };

        const validated = profileSchema.safeParse(data);

        if (!validated.success) {
            return {
                success: false,
                errors: validated.error.flatten().fieldErrors,
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            validated.data,
            { new: true }
        );

        revalidatePath("/");
        revalidatePath("/profile");

        return {
            success: true,
            message: messages.PROFILE_UPDATED,
            user: JSON.parse(JSON.stringify(updatedUser)),
        };

    } catch (error) {
        console.log("Failed to update profile:", error);

        return {
            success: false,
            message: messages.SOMETHNG_WENT_WRONG,
        };
    }
}

export async function updateProfileImage(formData: FormData) {
    try {
        await connectDB();

        const currentUser = await getUser();

        if (!currentUser) {
            return {
                success: false,
                message: messages.UNAUTHERISED,
            };
        }

        const removeImage = formData.get("removeImage");

        let profilePic = currentUser.profilePic || "";

        if (removeImage === "true") {
            profilePic = "";
        } else {
            const image = formData.get("image") as File;


            if (!image || image.size === 0) {
                return {
                    success: false,
                    message: messages.PLS_SELECT_IMAGE
                };
            }

            const validatedImage = imageSchema.safeParse(image);

            if (!validatedImage.success) {
                return {
                    success: false,
                    message:
                        validatedImage.error.issues[0].message,
                };
            }

            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

            const uploaded = await cloudinary.uploader.upload(base64, {
                folder: "profile",
            });

            profilePic = uploaded.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { profilePic },
            { new: true }
        );

        revalidatePath("/");
        revalidatePath("/profile");

        return {
            success: true,
            message: messages.PROFILE_IMAGE_UPDATED,
            user: JSON.parse(JSON.stringify(updatedUser)),
        };

    } catch (error) {
        console.log("Failed to update profile image:", error);

        return {
            success: false,
            message: messages.SOMETHNG_WENT_WRONG,
        };
    }
}

export async function forgotPassword(
    prevState: any,
    formData: FormData
) {
    try {
        await connectDB();

        const validated = forgotPasswordSchema.safeParse({
            email: formData.get("email"),
        });

        if (!validated.success) {
            return {
                success: false,
                errors:
                    validated.error.flatten().fieldErrors,
            };
        }

        const { email } = validated.data;

        const user = await User.findOne({ email });

        if (!user) {
            return {
                success: false,
                message: messages.USER_NOT_FOUND,
            };
        }

        const token = crypto.randomBytes(32).toString("hex");

        await PasswordReset.create({
            userId: user._id,
            token,
            expiresAt:
                new Date(Date.now() + 1000 * 60 * 15),
        });

        const resetLink =
            `${process.env.NEXT_PUBLIC_APP_URL}` +
            `/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Password",

            html: `
                <h2>Password Reset</h2>

                <p>Click below link to reset password:</p>

                <a href="${resetLink}">
                    Reset Password
                </a>

                <p>This link expires in 15 minutes.</p>
            `,
        });

        return {
            success: true,
            message: messages.RESET_LINK_TO_MAIL,
        };

    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: messages.SOMETHNG_WENT_WRONG,
        };
    }
}


export async function resetPassword(
    token: string,
    prevState: any,
    formData: FormData
) {
    try {
        await connectDB();

        const validated =
            resetPasswordSchema.safeParse({
                password: formData.get("password"),
                confirmPassword:
                    formData.get("confirmPassword"),
            });

        if (!validated.success) {
            return {
                success: false,
                errors:
                    validated.error.flatten().fieldErrors,
            };
        }

        const resetDoc =
            await PasswordReset.findOne({
                token,
            });

        if (!resetDoc) {
            return {
                success: false,
                message: messages.INVALID_RESET_TOKEN,
            };
        }

        if (
            new Date(resetDoc.expiresAt) < new Date()
        ) {
            return {
                success: false,
                message: messages.RESET_TOKEN_EXPIRED,
            };
        }

        const hashedPassword =
            await bcrypt.hash(
                validated.data.password,
                10
            );

        await User.findByIdAndUpdate(
            resetDoc.userId,
            {
                password: hashedPassword,
            }
        );

        await PasswordReset.deleteOne({
            token,
        });

        return {
            success: true,
            message: messages.PASSWORD_RESET_SUCCESS,
        };

    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: messages.SOMETHNG_WENT_WRONG,
        };
    }
}