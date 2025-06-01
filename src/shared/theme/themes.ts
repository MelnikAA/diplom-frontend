export type AppTheme = "default" | "red" | "blue";

interface ThemeColors {
  primary: string;
  secondary: string;
  secondary2: string;
}

export const THEMES: Record<AppTheme, ThemeColors> = {
  default: {
    primary: "#340bd4", //фиолетовы-красный
    secondary: "#340bd4", //фиолетовый-черный
    secondary2: "#BC002D", //красынй-красный
  },
  red: {
    primary: "#DB1D1F",
    secondary: "#000000",
    secondary2: "#DB1D1F",
  },
  blue: {
    primary: "#340bd4",
    secondary: "#340bd4",
    secondary2: "#340bd4",
  },
};

export const getCurrentTheme = (): AppTheme => {
  return (import.meta.env.VITE_APP_THEME || "default") as AppTheme;
};
