import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../createAppSlice";

interface themeSliceModel {
  theme: string;
  status: "idle" | "pending" | "error";
}

const themeInitialState: themeSliceModel = {
  status: "idle",
  theme: typeof window !== "undefined" ? localStorage.getItem("theme") || 'light' : 'light'
};

export const ThemeSlice = createAppSlice({
  name: "theme",
  initialState: themeInitialState,
  reducers: (create) => ({
    toggleTheme: create.reducer((state, actions: PayloadAction<string>) => {
      const theme = actions.payload == "light" ? "dark" : "light";

      state.theme = theme;
      const isDarkMode = theme == "dark";
      console.log("isDarkMode", isDarkMode);

      localStorage.setItem("theme", theme);

      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }),
    toggleThemeAsync: create.asyncThunk(
      async (theme: string) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return theme;
      },
      {
        fulfilled: (state, actions: PayloadAction<string>) => {
          state.status = "idle";
          state.theme = actions.payload;
          localStorage.setItem("theme", actions.payload);
        },
        pending: (state) => {
          state.status = "pending";
        },
        rejected: (state) => {
          state.status = "error";
        },
      }
    ),
  }),
  selectors: {
    selectTheme: (selector) => selector.theme,
    selectStatus: (selector) => selector.status,
  },
});

export const { toggleTheme, toggleThemeAsync } = ThemeSlice.actions;
export const { selectTheme, selectStatus } = ThemeSlice.selectors;

export default ThemeSlice.reducer;
