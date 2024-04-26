import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, GlobalStyles } from "@mui/material";
import { ModalProvider } from "./hooks/useModal";
import theme from "./theme";
import Games from "./Games";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={(theme) => ({
            body: {
              color: theme.palette.text.primary,
              background: theme.palette.background.default,
            },
            "body .MuiDataGrid-root": {
              border: 0,
              "--unstable_DataGrid-radius": 0,
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              ".MuiDataGrid-columnHeaders": {
                background: theme.palette.secondary.dark,
              },
            },
          })}
        />
        <ModalProvider>
          <Games />
        </ModalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
