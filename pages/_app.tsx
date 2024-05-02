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
import { AIEngineStorage, AIEngineModel } from "@/lib/aiengine-storage";
import { AIEngineValueContext } from "@/lib/aiengine-value-provider";
import { AIEngineStorageContext } from "@/lib/aiengine-storage-provider";

export default function App({ Component, pageProps }: AppProps) {
  const storage = new LocalDataStorage();
  const apiKeyStorage = useMemo(() => {
    const storage = new ApiKeyStorage();
    storage.addObserver((newKey) => setApiKey(newKey));
    return storage;
  }, []);
  const aiEngineStorage = useMemo(() => {
    const storage = new AIEngineStorage();
    storage.addObserver((newAiEngine) => {
      setAiEngine(newAiEngine);
    });
    return storage;
  }, []);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [aiEngine, setAiEngine] = useState<AIEngineModel>(AIEngineModel.Gpt3_5);
  const [chatSessions, setChatSessions] = useState([] as ChatSession[]);

  // useEffect che carica la roba dallo storage, con funzione asincrona
  // poi lo setta nello state
  // il provider lo passa a tutti i figli
  storage.addObserver(() => {
    async function updateMessages() {
      const chatSessions = await storage.getAll();
      setChatSessions(chatSessions);
    }


    updateMessages();
  });
  
  useEffect(() => {
    setApiKey(apiKeyStorage.getAPIKey());
    setAiEngine(aiEngineStorage.getAIEngine());
  }, [apiKeyStorage, aiEngineStorage]);

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
      <AIEngineValueContext.Provider value={aiEngine}>
        <AIEngineStorageContext.Provider value={aiEngineStorage}>
          <ApiKeyValueContext.Provider value={apiKey}>
            <ApiKeyStorageContext.Provider value={apiKeyStorage}>
              <DataStorageContext.Provider value={storage}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </DataStorageContext.Provider>
            </ApiKeyStorageContext.Provider>
          </ApiKeyValueContext.Provider>
        </AIEngineStorageContext.Provider>
      </AIEngineValueContext.Provider>
    </Fragment>
  );
}
