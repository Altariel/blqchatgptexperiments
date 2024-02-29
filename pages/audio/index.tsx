import React from "react";
import { OpenAI } from "openai";
import styles from './index.module.css'
import { isOpenApiError, transcribe } from "@/lib/openai-utils";

export default function Audio() {
  const inputAPIKeyRef = React.useRef<HTMLInputElement>(null);
  const [chatGPTAnswer, setChatGPTAnswer] = React.useState<string>("");

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file === undefined) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      const result = event.target?.result;
      if (typeof result === "string") {
        console.log(result);
      }

      if (inputAPIKeyRef.current === null) {
        return;
      }

      const response = await transcribe(inputAPIKeyRef.current.value, file);
      if (!isOpenApiError(response)) {
        setChatGPTAnswer(response);
      }
    };
    reader.readAsDataURL(file);
  }

  return <div className={styles.main}>
    <h1>Audio</h1>
    <form className={styles.label}>
      <label htmlFor='api-key'>API Key</label>
      <input className={styles.input} id="api-key" ref={inputAPIKeyRef} type="text" />
    </form>
    <div className={styles.label}>
      <label htmlFor='audiofile'>File</label>
      <input id="audiofile" type="file" accept="audio/*" onChange={onFileChange} />
    </div>
    <div>{chatGPTAnswer}</div>
  </div>
}