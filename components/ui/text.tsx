import * as React from "react";
import { cn } from "~/lib/utils";

export const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const textClass = React.useContext(TextClassContext);
  const Comp = asChild ? "span" : "span";
  return (
    <Comp
      className={cn(
        "text-base text-foreground select-text dark:text-white",
        textClass,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Text.displayName = "Text";

export { Text };
