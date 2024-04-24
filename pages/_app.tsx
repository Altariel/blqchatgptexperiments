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
import { ChatSession } from "@/types/chattypes";
import { ChatSessionsValueContext } from "@/lib/chat-sessions-value-provider";

export default function App({ Component, pageProps }: AppProps) {

  const storage = useMemo(() => new LocalDataStorage(), []);
  const apiKeyStorage = useMemo(() => new ApiKeyStorage(), []);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState([] as ChatSession[]);

  apiKeyStorage.addObserver((newKey) => setApiKey(newKey));

  storage.addObserver(() => {
    async function updateMessages() {
      const chatSessions = await storage.getAll();
      setChatSessions(chatSessions);
    }

    updateMessages();
  });
  
  useEffect(() => {
    setApiKey(apiKeyStorage.getAPIKey());
  }, [apiKeyStorage]);

  useEffect(() => {
    async function fetchData() {
      const chatSessions = await storage.getAll();
      setChatSessions(chatSessions);
    }

    fetchData();
  }, [storage]);

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
          <ChatSessionsValueContext.Provider value={chatSessions}>
            <DataStorageContext.Provider value={storage}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </DataStorageContext.Provider>
          </ChatSessionsValueContext.Provider>
        </ApiKeyStorageContext.Provider>
      </ApiKeyValueContext.Provider>
    </Fragment>
  );
}
