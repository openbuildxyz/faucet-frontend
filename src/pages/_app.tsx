// pages/_app.tsx
import Head from "next/head";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import Layout from '../components/Layout';

// @ts-ignore: allow importing CSS without declarations
import "../styles/globals.css"; // 确保全局样式引入

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <Layout>
          <Head>
            <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
}

export default App;
