import { authClient } from "@/auth";

export const updateProfileImage = async (imageUrl: string) => {
  const { error } = await authClient.updateUser({ image: imageUrl });

  if (error) {
    throw new Error(error.message ?? "Failed to update profile image");
  }

  await authClient.getSession();
};
