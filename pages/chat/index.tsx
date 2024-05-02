import Button from '@mui/material/Button';
import React, { useContext, useEffect } from 'react';

import ChatMessage from '@/components/chatmessage';
import { AIEngineValueContext } from '@/lib/aiengine-value-provider';
import { CustomRole, Message, OpenAIRole, getChatSessionId } from '@/types/chattypes';
import SendIcon from '@mui/icons-material/Send';
import { Box, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { ApiKeyValueContext } from '@/lib/apikey-value-provider';
import { DataStorageContext } from '@/lib/data-storage-provider';
import { chat, isOpenApiError } from '@/lib/openai-utils';

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      content: "How can I assist you today?",
      role: OpenAIRole.Assistant,
      timestamp: Date.now(),
    },
    {
      id: 2,
      content: "You are a helpful assistant",
      role: OpenAIRole.System,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = React.useState("");

  const router = useRouter();
  const apiKey = useContext(ApiKeyValueContext);
  const dataStorageContext = useContext(DataStorageContext);
  const aiEngineModel = useContext(AIEngineValueContext);

  useEffect(() => {
    async function fetchData() {
      const data = router.query;
      if (data.id) {
        const oldMessages = await dataStorageContext.get(data.id as string);
        if (oldMessages) {
          setMessages(oldMessages.messages);
        }
      }
    }

    fetchData();
  }, [router.query, dataStorageContext]);

  // TODO: set che chat model

  async function handleSendToAI() {
    const message = input.trim();
    if (message === "") {
      return;
    }
    setInput("");

    const newMessages = messages.concat([{ id: messages.length + 1, content: message, role: OpenAIRole.User, timestamp: Date.now() }]);

    if (!apiKey) {
      newMessages.push({ id: newMessages.length + 1, content: "API Key not set", role: CustomRole.Application, timestamp: Date.now() });
      setMessages(newMessages);
      return;
    }
    
    const response = await chat(apiKey, aiEngineModel, newMessages);
    if (!isOpenApiError(response)) {
      newMessages.push({ id: newMessages.length + 1, content: response, role: OpenAIRole.Assistant, timestamp: Date.now() });
      setMessages(newMessages);

      dataStorageContext.set({
        id: getChatSessionId(newMessages),
        messages: newMessages
      });
    }
    else {
      setMessages(mess => mess.concat([{ id: mess.length + 1, content: response.message, role: OpenAIRole.Assistant, timestamp: Date.now() }]))
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendToAI();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const messagesToDisplay = messages.filter((m) => m.role !== OpenAIRole.System);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "red",
        height: "100%"
      }}
    >
      <Box
        sx={{ flexGrow: 1, overflow: "auto", p: 2, backgroundColor: "blue" }}
      >
        {messagesToDisplay.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </Box>
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              placeholder="Type a message"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendToAI}
              disabled={!input.trim() || !apiKey}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  // return (
  //   <div className={styles.main}>
  //     <h1>Chat</h1>
  //     <div> model: "gpt-3.5-turbo"</div>
  //     <form>
  //       <div className={styles.label}>
  //         <label htmlFor='api-key'>API Key</label>
  //         <input className={styles.input} id="api-key" ref={inputAPIKeyRef} type="text" />
  //       </div>
  //       <div className={styles.label}>
  //         <label htmlFor='query'>Query</label>
  //         <input className={styles.input} id="query" ref={queryRef} type="text" defaultValue="Chi e' il presidente degli stati uniti?" />
  //       </div>
  //       <div><button onClick={handleSendToAI} >Go</button></div>
  //       <div>{chatGPTAnswer}</div>
  //     </form>
  //   </div>
  // )
}
