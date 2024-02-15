import { OpenAI } from "openai";
import styles from './index.module.css'
import React from 'react';

export default function Chat() {
  const inputAPIKeyRef = React.useRef<HTMLInputElement>(null);
  const queryRef = React.useRef<HTMLInputElement>(null);
  const [chatGPTAnswer, setChatGPTAnswer] = React.useState<string>("");

  async function handleSendToAI() {
    const model = "gpt-4-0125-preview";

    if (inputAPIKeyRef.current === null || queryRef.current === null) {
      return;
    }

    const apiKey = inputAPIKeyRef.current.value;

    const openai = new OpenAI({
      apiKey: apiKey, dangerouslyAllowBrowser: true
    });

    const query = queryRef.current.value;

    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: query,
          }]
      });

      const responseMessages = response.choices[0].message.content;
      if (responseMessages) {
        setChatGPTAnswer(responseMessages);
      } else {
        setChatGPTAnswer("No answer");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.main}>
      <h1>Chat</h1>
      <div> model: "gpt-3.5-turbo"</div>
      <form>
        <div className={styles.label}>
          <label htmlFor='api-key'>API Key</label>
          <input className={styles.input} id="api-key" ref={inputAPIKeyRef} type="text" />
        </div>
        <div className={styles.label}>
          <label htmlFor='query'>Query</label>
          <input className={styles.input} id="query" ref={queryRef} type="text" defaultValue="Chi e' il presidente degli stati uniti?" />
        </div>
        <div><button onClick={handleSendToAI} >Go</button></div>
        <div>{chatGPTAnswer}</div>
      </form>
    </div>
  )
}
