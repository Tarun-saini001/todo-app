import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    date: Date;
    priority: "Extreme" | "Moderate" | "Low";
    description?: string;
    image?: string;
    status: "pending" | "in-progress" | "completed";
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: Date,
            required: true,
        },

        priority: {
            type: String,
            enum: ["Extreme", "Moderate", "Low"],
            default: "Moderate",
        },

        description: {
            type: String,
            default:""
        },

        image: {
            type: String,
        },

        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Task =
    mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);