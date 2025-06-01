import {
  Checkbox,
  createTheme,
  TextInput,
  Select,
  type MantineThemeOverride,
  Loader,
} from "@mantine/core";
import s from "./mantineCustomStyles.module.scss";
import { getCurrentTheme, THEMES } from "../theme/themes";

// Функция для создания темы Mantine с учетом выбранной цветовой схемы
export const getMantineTheme = (): MantineThemeOverride => {
  const currentTheme = getCurrentTheme();
  const colors = THEMES[currentTheme];

  return createTheme({
    fontFamily: "Roboto",
    breakpoints: {
      xs: "30em",
      sm: "48em",
      smplus: "58em",
      md: "64em",
      lg: "74em",
      xl: "90em",
    },
    components: {
      Checkbox: Checkbox.extend({
        classNames: {
          input: s.checkboxInput,
        },
      }),
      TextInput: TextInput.extend({
        classNames: {
          input: s.inputStyles,
        },
      }),

      Select: Select.extend({
        classNames: {
          input: s.inputStyles,
        },
      }),
    },
    cursorType: "pointer",
    primaryColor: "primary",

    colors: {
      primary: [
        colors.primary,
        colors.primary,
        colors.primary,
        colors.primary,
        colors.primary,
        colors.primary,
        colors.primary,
        colors.primary,
        colors.primary,
        colors.primary,
      ],
      secondary: [
        colors.secondary,
        colors.secondary,
        colors.secondary,
        colors.secondary,
        colors.secondary,
        colors.secondary,
        colors.secondary,
        colors.secondary,
        colors.secondary,
        colors.secondary,
      ],
      secondary2: [
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
        colors.secondary2,
      ],
    },
  });
};

export const mantineTheme = getMantineTheme();
