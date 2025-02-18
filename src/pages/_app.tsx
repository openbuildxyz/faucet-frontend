import "@/styles/globals.css";
import Head from 'next/head';
import type { AppProps } from "next/app";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="https://openbuild.xyz/favicon-96x96.png" />
      </Head>
      <Component {...pageProps} />
      </>
  )
}

export default App
