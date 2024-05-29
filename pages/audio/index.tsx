import { AIEnginesContext } from "@/lib/aiengine-provider";
import { ApiKeyContext } from "@/lib/api-key-provider";
import { isOpenApiError, transcribe } from "@/lib/openai-utils";
import { TranscribeSessionsContext } from "@/lib/transcribe-sessions-provider";
import React, { useContext, useEffect } from "react";
import styles from './index.module.css';
import thinkingGif from '@/public/thinking.gif';
import Image from 'next/image';
import { useRouter } from "next/router";

export default function Audio() {
  const [audioTranscription, setAudioTranscription] = React.useState<string>("");
  const apiKey = useContext(ApiKeyContext).apiKey;
  const { aiEnginesStorage: aiEngineStorage, aiEngines: aiEngine } = useContext(AIEnginesContext);
  const { storage, transcribeSessions } = useContext(TranscribeSessionsContext);
  const [showBubble, setShowBubble] = React.useState(false);
  const router = useRouter();
  const [buttonText, setButtonText] = React.useState("none");

  useEffect(() => {
    async function fetchData() {
      const data = router.query;
      if (data.id) {
        const oldMessage = await storage.get(data.id as string);
        if (oldMessage) {
          setAudioTranscription(oldMessage.trascription);
          setButtonText(oldMessage.id);
        }
      }
    }

    fetchData();
  }, [router.query, storage]);
  
  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file === undefined || !apiKey) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      const result = event.target?.result;
      if (typeof result === "string") {
        console.log(result);
      }

      setShowBubble(true);
      const response = await transcribe(apiKey, file, aiEngine.transcribe);
      setShowBubble(false);
      if (!isOpenApiError(response)) {
        setAudioTranscription(response);
        storage.set({
          id: file.name,
          trascription: response,
       });
      }
    };

    if (inputRef.current) {
      setButtonText(file.name);
    }

    reader.readAsDataURL(file);
  }

  function onButtonClick() {
    const fileInput = document.getElementById('audiofile');
    fileInput && fileInput.click();
  }

  return <div className={styles.main}>
    <h1>Audio</h1>
    <div className={styles.label}>
      <label htmlFor='audiofile'>File</label>
      <input id="audiofile" type="file" accept="audio/*" onChange={onFileChange} style={{display: "none"}}  />
      <input type="button" disabled={!apiKey} value={buttonText} onClick={onButtonClick} />
    </div>
    {showBubble && <Image src={thinkingGif} alt="thinking" />}
    <div>{audioTranscription}</div>
  </div>
}