import * as React from "react";

type ColorScheme = "light" | "dark";

export function useColorScheme() {
  const [colorScheme, setColorSchemeState] = React.useState<ColorScheme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme") as ColorScheme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(colorScheme);
    localStorage.setItem("theme", colorScheme);
  }, [colorScheme]);

  const setColorScheme = React.useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const isDarkColorScheme = colorScheme === "dark";

  return { colorScheme, setColorScheme, isDarkColorScheme };
}
