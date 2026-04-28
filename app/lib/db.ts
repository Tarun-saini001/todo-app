import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI: ', MONGODB_URI);


export default async function connectDB(){
    if(!MONGODB_URI){
        throw new Error("MONGODB_URI Not Found")
    }
    if(mongoose.connection.readyState===1)return;
    await mongoose.connect(MONGODB_URI);

}   