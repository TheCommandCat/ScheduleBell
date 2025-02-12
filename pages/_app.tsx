import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import theme from "@/lib/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />;
      </ThemeProvider>
    </>
  );
}
