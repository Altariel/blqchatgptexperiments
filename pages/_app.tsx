'use client';

import "@/styles/globals.css";
import 'typeface-roboto'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment, useEffect, useMemo, useState } from "react";
import Layout from '../components/layout'
import { DataStorageContext } from "@/lib/data-storage-provider";
import { LocalDataStorage } from "@/lib/local-data-storage";
import { ApiKeyStorageContext } from "@/lib/apikey-storage-provider";
import { ApiKeyStorage } from "@/lib/apikey-storage";
import React from "react";
import { ApiKeyValueContext } from "@/lib/apikey-value-provider";

export default function App({ Component, pageProps }: AppProps) {
  const storage = new LocalDataStorage();
  const apiKeyStorage = useMemo(() => new ApiKeyStorage(), []);
  const [apiKey, setApiKey] = useState<string | null>(null);

  apiKeyStorage.addObserver((newKey) => setApiKey(newKey));

  // useEffect che carica la roba dalo storage, con funzione asincrona
  // poi lo setta nello state
  // il provider lo passa a tutti i figli

  useEffect(() => {
    setApiKey(apiKeyStorage.getAPIKey());
  }, [apiKeyStorage]);

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
      <ApiKeyValueContext.Provider value={apiKey}>
        <ApiKeyStorageContext.Provider value={apiKeyStorage}>
          <DataStorageContext.Provider value={storage}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </DataStorageContext.Provider>
        </ApiKeyStorageContext.Provider>
      </ApiKeyValueContext.Provider>
    </Fragment>
  );
}
