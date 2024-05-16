'use client';

import { AIEnginesContext } from "@/lib/aiengine-provider";
import { AIEnginesStorage, AIEnginesType, DefaultEngines } from "@/lib/aiengine-storage";
import { ApiKeyContext } from "@/lib/api-key-provider";
import { ApiKeyStorage } from "@/lib/apikey-storage";
import { ChatSessionsContext } from "@/lib/chat-sessions-provider";
import { LocalDataStorage } from "@/lib/local-data-storage";
import "@/styles/globals.css";
import { ChatSession } from "@/types/chattypes";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Fragment, useEffect, useMemo, useState } from "react";
import 'typeface-roboto';
import Layout from '../components/layout';
import theme from "./theme";

export default function App({ Component, pageProps }: AppProps) {

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [aiEngines, setAiEngines] = useState<AIEnginesType>(DefaultEngines);
  const [chatSessions, setChatSessions] = useState([] as ChatSession[]);

  const storage = useMemo(() => {
    const dataStorage = new LocalDataStorage();
    dataStorage.addObserver(() => {
      async function updateMessages() {
        const chatSessions = await dataStorage.getAll();
        setChatSessions(chatSessions);
      }

      updateMessages();
    });

    return dataStorage;
  }, []);

  const apiKeyStorage = useMemo(() => {
    const storage = new ApiKeyStorage();
    storage.addObserver((newKey) => setApiKey(newKey));
    return storage;
  }, []);

  const aiEnginesStorage = useMemo(() => {
    const storage = new AIEnginesStorage();
    storage.addObserver((newAiEngines) => {
      setAiEngines(newAiEngines);
    });
    return storage;
  }, []);

  useEffect(() => {
    setApiKey(apiKeyStorage.getAPIKey());
    setAiEngines(aiEnginesStorage.getAIEngines());
  }, [apiKeyStorage, aiEnginesStorage]);

  useEffect(() => {
    async function fetchData() {
      const chatSessions = await storage.getAll();
      setChatSessions(chatSessions);
    }

    fetchData();
  }, [storage]);

  return (<Fragment>
      <ThemeProvider theme={theme}>
      <Head>
        <title>BLQ Chat</title>
        <meta
          name="description"
          content="A web app that does the ChatGPT queries for you"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AIEnginesContext.Provider value={{ aiEnginesStorage: aiEnginesStorage, aiEngines }}>
        <ApiKeyContext.Provider value={{ apiKeyStorage, apiKey }}>
          <ChatSessionsContext.Provider value={{ storage, chatSessions }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChatSessionsContext.Provider>
        </ApiKeyContext.Provider>
      </AIEnginesContext.Provider>
    </ThemeProvider>
    </Fragment>
  );
}
