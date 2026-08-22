import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileStore } from "../stores/profile";
import { Camera } from "lucide-react";

interface ProfileImageUploadProps {
  image: string | null | undefined;
  userId: string;
}

export function ProfileImageUpload({ image, userId }: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadImage } = useProfileStore();

  function handleClick() {
    fileInputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      uploadImage(result, userId);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  }

  return (
    <div className="relative self-center" onClick={handleClick}>
      <Avatar className="bg-teal-500 w-36 h-36 md:w-40 md:h-40 cursor-pointer">
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback className="rounded-xl bg-slate-500" />
      </Avatar>
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
        <Camera className="w-8 h-8 text-white" />
      </div>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
