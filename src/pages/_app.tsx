import React from "react";
import "../globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { MainLayout } from "@/components/layouts/MainLayout.";
import { Storelayout } from "@/components/layouts/StoreLayout";


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [showGridDebug, setShowGridDebug] = React.useState(false);

  // React.useEffect(() => {
  //   setShowGridDebug(window.location.hostname === 'localhost');
  // }, []);

  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <Storelayout>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Storelayout>
  );
}