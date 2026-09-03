import { uploadImageFromUri } from "@/lib/cloudinary";

const PROFILE_IMAGE_FOLDER = "monedo/users";

export const uploadProfileImage = async (
  imageUri: string,
  publicId: string,
): Promise<string> => {
  return uploadImageFromUri(imageUri, PROFILE_IMAGE_FOLDER, publicId);
};
