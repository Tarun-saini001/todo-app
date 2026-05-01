import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI Not Found");
  }


  if ((global as any).mongoose) {
    return (global as any).mongoose;
  }

  const conn = await mongoose.connect(MONGODB_URI);

  (global as any).mongoose = conn;

  return conn;
}