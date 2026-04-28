import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRefreshToken extends Document {
    userId: Types.ObjectId;
    refreshToken: string;
    expiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const tokenSchema: Schema<IRefreshToken> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const RefreshTokenModel = mongoose.models.refreshToken || mongoose.model<IRefreshToken>("refreshToken", tokenSchema);

export default RefreshTokenModel;