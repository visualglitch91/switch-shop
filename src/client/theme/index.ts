import { createTheme, ThemeOptions } from "@mui/material";

const draculaPalette = {
  darkPurple: "#BD93F9",
  purple: "#6272A4",
  pink: "#FF79C6",
  darkPink: "#FF5555",
  background: "#282a36",
  foreground: "#f8f8f2",
  comment: "#6272a4",
  selection: "#44475a",
  cyan: "#8BE9FD",
  green: "#50fa7b",
  orange: "#ffb86c",
  yellow: "#f1fa8c",
  red: "#FF5555",
};

const theme = createTheme({
  shape: {
    borderRadius: 12,
  },
  palette: {
    mode: "dark",
    primary: {
      main: draculaPalette.pink,
    },
    secondary: {
      main: draculaPalette.purple,
    },
    error: {
      main: draculaPalette.red,
    },
    info: {
      main: draculaPalette.cyan,
    },
    success: {
      main: draculaPalette.green,
    },
    warning: {
      main: draculaPalette.orange,
    },
  },
});

export default theme;
