'use client';

import React from "react";
import { OpenAI } from "openai";
import styles from './page.module.css'

export default function Audio() {
  const inputAPIKeyRef = React.useRef<HTMLInputElement>(null);

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

      const model = "gpt-3.5-turbo";
      const apiKey = inputAPIKeyRef.current.value;

      const openai = new OpenAI({
        apiKey: apiKey, dangerouslyAllowBrowser: true
      });

      try {
        // const response = await openai.createChatCompletion({
        const response = await openai.audio.transcriptions.create({
          file: file,
          model: model,
          language: "it",
          response_format: "verbose_json",
        });

        console.log(response);
      } catch (error) {
        console.log(error);
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
  </div>
}