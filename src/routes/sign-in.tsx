import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        console.error("[SignIn] Error:", error);
        toast.error(error.message ?? "Credenciales inválidas");
        return;
      }

      console.log("[SignIn] Sign-in successful, navigating to /" , { email });
      window.location.href = "/";
    } catch (err) {
      console.error("[SignIn] Unexpected error:", err);
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src="/logo.png"
            alt="Monedo"
            className="w-24 h-24"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <h1 className="text-3xl font-bold text-center">Bienvenido a Monedo</h1>
          <p className="text-center text-muted-foreground">
            Inicia sesión para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-muted-foreground">
              O
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          Continuar con Google
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿No tienes cuenta?{" "}
          <Link to="/sign-up" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
