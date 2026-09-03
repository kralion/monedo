import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogOut } from "lucide-react";
import { authClient } from "@/auth";
import { ProfileImageUpload } from "@/components/profile/components/ProfileImageUpload";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

interface ProfileForm {
  firstName: string;
  lastName: string;
}

function ProfilePage() {
  const { user, isPending } = useNeonUser();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      });
    }
  }, [user, reset]);

  async function onSubmit(data: ProfileForm) {
    setSaving(true);
    try {
      const name = [data.firstName, data.lastName].filter(Boolean).join(" ");
      const { error } = await authClient.updateUser({ name });
      if (error) {
        toast.error(error.message ?? "Error al guardar");
        return;
      }
      await authClient.getSession();
      toast.success("Perfil actualizado");
    } catch {
      toast.error("Error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    navigate({ to: "/sign-in" });
  }

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Perfil</h1>

      <div className="flex flex-col items-center gap-6 mb-8">
        <ProfileImageUpload image={user.image} userId={user.id} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" {...register("firstName")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" {...register("lastName")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Correo electrónico</Label>
          <Input value={user.email} disabled />
        </div>

        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </form>

      <div className="mt-12">
        <Button
          variant="destructive"
          size="lg"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
