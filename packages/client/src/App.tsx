import CssBaseline from "@mui/material/CssBaseline";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/queryClient";
import { SocketIOProvider } from "./utils/api";
import { ModalProvider } from "./utils/useModal";
import SwitchShop from "./SwitchShop";
import { ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#282a36", paper: "#282a36" },
    primary: { main: "#BD93F9" },
    secondary: { main: "#FF79C6" },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SocketIOProvider>
          <ModalProvider>
            <SwitchShop />
          </ModalProvider>
        </SocketIOProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
