import { uploadToCloudinary } from "@/lib/cloudinary";

const PROFILE_IMAGE_FOLDER = "monedo/users";

export const uploadProfileImage = async (
  imageUri: string,
  publicId: string,
): Promise<string> => {
  if (imageUri.startsWith("data:")) {
    const base64Data = imageUri.split(",")[1];
    if (!base64Data) throw new Error("Invalid image data URL");
    const uniquePublicId = `${publicId}-${Date.now()}`;
    return uploadToCloudinary({
      base64Image: base64Data,
      folder: PROFILE_IMAGE_FOLDER,
      publicId: uniquePublicId,
    });
  }

  const { uploadImageFromUri } = await import("@/lib/cloudinary");
  const uniquePublicId = `${publicId}-${Date.now()}`;
  return uploadImageFromUri(imageUri, PROFILE_IMAGE_FOLDER, uniquePublicId);
};
