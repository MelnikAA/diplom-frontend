export type AppTheme = "default" | "red" | "blue";

interface ThemeColors {
  primary: string;
  secondary: string;
  secondary2: string;
}

export const THEMES: Record<AppTheme, ThemeColors> = {
  default: {
    primary: "#72C0D9", //фиолетовы-красный
    secondary: "#72C0D9", //фиолетовый-черный
    secondary2: "#72C0D9", //красынй-красный
  },
  red: {
    primary: "#72C0D9",
    secondary: "#72C0D9",
    secondary2: "#72C0D9",
  },
  blue: {
    primary: "#72C0D9",
    secondary: "#72C0D9",
    secondary2: "#72C0D9",
  },
};

export const getCurrentTheme = (): AppTheme => {
  return (import.meta.env.VITE_APP_THEME || "default") as AppTheme;
};
