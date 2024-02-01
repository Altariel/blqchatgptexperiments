'use client'

const { OpenAI } = require("openai");
import styles from './page.module.css'
import React from 'react';

export default function Home() {
  const inputAPIKeyRef = React.useRef<HTMLInputElement>(null);
  const queryRef = React.useRef<HTMLInputElement>(null);
  const [chatGPTAnswer, setChatGPTAnswer] = React.useState<string>("");

  async function handleSendToAI() {
    const model = "gpt-3.5-turbo";

    if (inputAPIKeyRef.current === null || queryRef.current === null) {
      return;
    }

    const apiKey = inputAPIKeyRef.current.value;

    const openai = new OpenAI({
      apiKey: apiKey, dangerouslyAllowBrowser: true
    });

    const query = queryRef.current.value;

    try {
      // const response = await openai.createChatCompletion({
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: query,
            // temperature: 0,
            // max_tokens: 500,
            // top_p: 1.0,
            // frequency_penalty: 0.0,
            // presence_penalty: 0.0,
          }]
      });

      setChatGPTAnswer(response.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div> model: "gpt-3.5-turbo"</div>
      <div className={styles.main}>
        <div className={styles.label}>
          <label htmlFor='api-key'>API Key</label>
          <input id="api-key" ref={inputAPIKeyRef} type="text" />
        </div>
        <div className={styles.label}>
          <label htmlFor='query'>Query</label>
          <input id="query" ref={queryRef} type="text" defaultValue="Chi e' il presidente degli stati uniti?" />
        </div>
        <div><button onClick={handleSendToAI} >Go</button></div>
        <div>{chatGPTAnswer}</div>
      </div>
    </>
  )
}
