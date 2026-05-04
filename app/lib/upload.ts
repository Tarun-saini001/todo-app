import cloudinary from "./cloudnary";

async function uploadToCloudinary(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "tasks" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(buffer);
    });
}

export default uploadToCloudinary;