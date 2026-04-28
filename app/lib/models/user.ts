import mongoose, { Document, model, Schema } from "mongoose";
import { required } from "zod/mini";

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    contactNumber: number,
    profilePic: string,
    gender: string,
    position: string,
    address:string,
    password: string,
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    gender: { type: String },
    profilePic: { type: String },
    contactNumber: { type: Number },
    position: { type: String },
    address: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true
})

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);