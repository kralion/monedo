import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
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
            Vincula una de tus cuentas para continuar
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
        />
      </div>
    </div>
  );
}
