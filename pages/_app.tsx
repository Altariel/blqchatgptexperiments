import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (<Fragment>
    <Head>
      <title>BLQ Chat</title>
      <meta name="description" content="A web app that does the ChatGPT queries for you" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </Fragment>);
}
