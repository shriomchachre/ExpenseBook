import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFromCloudinary = async (fileUri) => {
    try {
        if (!fileUri) return null;

        const publicId = fileUri.substring(
            fileUri.lastIndexOf("/") + 1,
            fileUri.lastIndexOf(".")
        );

        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.log("File delete failed:", err);
        return null;
    }
};

export default deleteFromCloudinary;
