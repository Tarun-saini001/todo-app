"use server"

import bcrypt from "bcryptjs"
import { IUser, User } from "@/app/lib/models/user"
import connectDB from "../lib/db"
import { redirect } from 'next/navigation';
import { registerSchema } from "../validations/auth.user";
import { messages } from "../constants/messages";

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
            message: 'Something went wrong. Please try again.',
        };
    }

    return {
        success: true,
        errors: {},
        message: "",
    };
}