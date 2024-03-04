import "@/styles/globals.css";
import 'typeface-roboto'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment } from "react";
import Layout from '../components/layout'

export default function App({ Component, pageProps }: AppProps) {
  return (<Fragment>
    <Head>
      <title>BLQ Chat</title>
      <meta name="description" content="A web app that does the ChatGPT queries for you" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
    <Component {...pageProps} />
    </Layout>
  </Fragment>);
}
