import { create } from "zustand";
import { uploadProfileImage } from "../api/services";
import { updateProfileImage } from "../api/db";
import { toast } from "sonner";

interface ProfileStore {
  uploading: boolean;
  uploadImage: (imageUri: string, userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  uploading: false,

  uploadImage: async (imageUri: string, userId: string) => {
    set({ uploading: true });

    try {
      const imageUrl = await uploadProfileImage(imageUri, userId);
      await updateProfileImage(imageUrl);
      toast.success("Imagen de perfil actualizada");
    } catch {
      toast.error("Error al actualizar la imagen de perfil");
    } finally {
      set({ uploading: false });
    }
  },
}));
