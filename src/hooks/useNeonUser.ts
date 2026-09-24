import { useMemo } from "react";
import { authClient } from "@/auth";

interface NeonUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
}

export function useNeonUser() {
  const { data, isPending } = authClient.useSession();

  const user: NeonUser | null = useMemo(() => {
    if (!data?.user) return null;
    return {
      id: data.user.id,
      firstName: data.user.name?.split(" ")[0] ?? null,
      lastName: data.user.name?.split(" ").slice(1).join(" ") ?? null,
      email: data.user.email,
      image: data.user.image ?? null,
    };
  }, [data?.user]);

  return { user, isPending };
}
