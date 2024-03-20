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
import { DataStorageContext } from "@/lib/data-storage-provider";
import { LocalDataStorage } from "@/lib/local-data-storage";

export default function App({ Component, pageProps }: AppProps) {
  const storage = new LocalDataStorage();

  // useEffect che carica la roba dalo storage, con funzione asincrona
  // poi lo setta nello state
  // il provider lo passa a tutti i figli
  return (
    <Fragment>
      <Head>
        <title>BLQ Chat</title>
        <meta
          name="description"
          content="A web app that does the ChatGPT queries for you"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DataStorageContext.Provider value={storage}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataStorageContext.Provider>
    </Fragment>
  );
}
