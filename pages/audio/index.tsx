import { AIEnginesContext } from "@/lib/aiengine-provider";
import { ApiKeyContext } from "@/lib/api-key-provider";
import { isOpenApiError, transcribe } from "@/lib/openai-utils";
import { TranscribeSessionsContext } from "@/lib/transcribe-sessions-provider";
import React, { useContext } from "react";
import styles from './index.module.css';

export default function Audio() {
  const [audioTranscription, setAudioTranscription] = React.useState<string>("");
  const apiKey = useContext(ApiKeyContext).apiKey;
  const { aiEnginesStorage: aiEngineStorage, aiEngines: aiEngine } = useContext(AIEnginesContext);
  const { storage, transcribeSessions } = useContext(TranscribeSessionsContext);

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

      const response = await transcribe(apiKey, file, aiEngine.transcribe);
      if (!isOpenApiError(response)) {
        setAudioTranscription(response);
        storage.set({
          id: file.name,
          trascription: response,
       });
      }
    };
    reader.readAsDataURL(file);
  }

  return <div className={styles.main}>
    <h1>Audio</h1>
    <div className={styles.label}>
      <label htmlFor='audiofile'>File</label>
      <input id="audiofile" type="file" accept="audio/*" onChange={onFileChange} disabled={!apiKey} />
    </div>
    <div>{audioTranscription}</div>
  </div>
}