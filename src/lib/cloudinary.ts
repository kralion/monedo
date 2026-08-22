/**
 * Cloudinary image upload utility
 * Handles image uploads to Cloudinary with base64 encoding
 */

interface UploadToCloudinaryOptions {
  base64Image: string;
  folder: string;
  publicId?: string;
}

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload image to Cloudinary
 * @param options - Upload configuration
 * @returns Promise with Cloudinary response containing secure_url
 */
export const uploadToCloudinary = async ({
  base64Image,
  folder,
  publicId,
}: UploadToCloudinaryOptions): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${base64Image}`);
    formData.append("upload_preset", "projects");
    formData.append("folder", folder);

    if (publicId) {
      formData.append("public_id", publicId);
    }

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/diqe1byxy/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Upload failed with status: ${response.status} - ${errorText}`,
      );
    }

    const data: CloudinaryResponse = await response.json();

    if (!data.secure_url) {
      throw new Error("No secure URL returned from Cloudinary");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

/**
 * Upload image from URI to Cloudinary
 * Converts URI to base64 and uploads
 * @param imageUri - Local image URI
 * @param folder - Cloudinary folder
 * @param publicId - Optional public ID
 * @returns Promise with secure URL
 */
export const uploadImageFromUri = async (
  imageUri: string,
  folder: string,
  publicId?: string,
): Promise<string> => {
  try {
    // Convert URI to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const base64Data = base64.split(",")[1]; // Remove data:image/jpeg;base64, prefix

          const secureUrl = await uploadToCloudinary({
            base64Image: base64Data,
            folder,
            publicId,
          });

          resolve(secureUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URI to base64:", error);
    throw error;
  }
};

// EXAMPLE OF USAGE FOR UPLOADING:
// const secureUrl = await uploadImageFromUri(imageUri, 'mimemoria/posts', publicId);
