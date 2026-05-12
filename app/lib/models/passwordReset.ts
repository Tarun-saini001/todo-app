import mongoose, { Document, Schema } from "mongoose";

export interface IPasswordReset extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        token: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PasswordReset = mongoose.models.PasswordReset || mongoose.model<IPasswordReset>(
    "PasswordReset", passwordResetSchema);