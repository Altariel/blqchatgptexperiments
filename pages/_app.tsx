'use client';

import { AIEnginesContext } from "@/lib/aiengine-provider";
import { AIEnginesStorage, AIEnginesType, DefaultEngines } from "@/lib/aiengine-storage";
import { ApiKeyContext } from "@/lib/api-key-provider";
import { ApiKeyStorage } from "@/lib/apikey-storage";
import { ChatSessionsContext } from "@/lib/chat-sessions-provider";
import { LocalDataStorage } from "@/lib/local-data-storage";
import "@/styles/globals.css";
import { ChatSession, GenerateSession, TranscribeSession } from "@/types/chattypes";
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
import { TranscribeSessionsContext } from "@/lib/transcribe-sessions-provider";
import { GenerateSessionsContext } from "@/lib/generate-sessions-provider";

const CHAT_HISTORY_STORAGE = "chatgpt-history";
const TRANSCRIBE_HISTORY_STORAGE = "transcribe-history";
const GENERATE_HISTORY_STORAGE = "generate-history";

export default function App({ Component, pageProps }: AppProps) {

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [aiEngines, setAiEngines] = useState<AIEnginesType>(DefaultEngines);
  const [chatSessions, setChatSessions] = useState([] as ChatSession[]);
  const [transcribeSessions, setTranscribeSessions] = useState([] as TranscribeSession[]);
  const [generateSessions, setGenerateSessions] = useState([] as GenerateSession[]);

  const chatStorage = useMemo(() => {
    const dataStorage = new LocalDataStorage<ChatSession>(CHAT_HISTORY_STORAGE);
    dataStorage.addObserver(() => {
      async function updateMessages() {
        const chatSessions = await dataStorage.getAll();
        setChatSessions(chatSessions);
      }

      updateMessages();
    });

    return dataStorage;
  }, []);

  const transcriptionsStorage = useMemo(() => {
    const dataStorage = new LocalDataStorage<TranscribeSession>(TRANSCRIBE_HISTORY_STORAGE);
    dataStorage.addObserver(() => {
      async function updateTranscriptions() {
        const transcribeSessions = await dataStorage.getAll();
        setTranscribeSessions(transcribeSessions);
      }

      updateTranscriptions();
    });

    return dataStorage;
  }, []);

  const generateSessionsStorage = useMemo(() => {
    const dataStorage = new LocalDataStorage<GenerateSession>(GENERATE_HISTORY_STORAGE);
    dataStorage.addObserver(() => {
      async function updateGeneratedImages() {
        const geneateSessions = await dataStorage.getAll();
        setGenerateSessions(geneateSessions);
      }

      updateGeneratedImages();
    });

    return dataStorage;
  }, []);

  const apiKeyStorage = useMemo(() => {
    const akstorage = new ApiKeyStorage();
    akstorage.addObserver((newKey) => setApiKey(newKey));
    return akstorage;
  }, []);

  const aiEnginesStorage = useMemo(() => {
    const aiestorage = new AIEnginesStorage();
    aiestorage.addObserver((newAiEngines) => {
      setAiEngines(newAiEngines);
    });
    return aiestorage;
  }, []);

  useEffect(() => {
    setApiKey(apiKeyStorage.getAPIKey());
    setAiEngines(aiEnginesStorage.getAIEngines());
  }, [apiKeyStorage, aiEnginesStorage]);

  useEffect(() => {
    async function fetchData() {
      const chatSessions = await chatStorage.getAll();
      setChatSessions(chatSessions);
    }

    fetchData();
  }, [chatStorage]);

  useEffect(() => {
    async function fetchData() {
      const transcribeSessions = await transcriptionsStorage.getAll();
      setTranscribeSessions(transcribeSessions);
    }

    fetchData();
  }, [transcriptionsStorage]);

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
          <ChatSessionsContext.Provider value={{ storage: chatStorage, chatSessions }}>
            <TranscribeSessionsContext.Provider value={{ storage: transcriptionsStorage, transcribeSessions }}>
              <GenerateSessionsContext.Provider value={{ storage: generateSessionsStorage, generateSessions }}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </GenerateSessionsContext.Provider>
            </TranscribeSessionsContext.Provider>
          </ChatSessionsContext.Provider>
        </ApiKeyContext.Provider>
      </AIEnginesContext.Provider>
    </ThemeProvider>
  </Fragment>
  );
}
