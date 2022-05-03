import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import {QueryClient, QueryClientProvider} from "react-query"
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <>
      <Head>
        <title>Youtube Clone</title>
        <meta
          name="viewport"
          content="minimum-scale-1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <NotificationsProvider>
          {getLayout(
            <main>
              <Component {...pageProps} />
            </main>
          )}
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
