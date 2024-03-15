import Button from '@mui/material/Button';
import React from 'react';
import styles from './index.module.css';

import ChatMessage from '@/components/chatmessage';
import { Sender, SentMessage } from '@/types/chattypes';
import SendIcon from '@mui/icons-material/Send';
import { Box, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { chat, chatModel, isOpenApiError } from '@/lib/openai-utils';
import { getAPIKey } from '@/lib/apikeyprovider';
import { setHistory } from '@/lib/historyprovider';

export default function Chat() {
  const [messages, setMessages] = React.useState<SentMessage[]>([{ id:1, message: "How can I assist you today?", sender: Sender.Bot },]);
  const [input, setInput] = React.useState("");

  async function handleSendToAI() {
    const model = chatModel;
    const message = input.trim();
    if (message === "") {
      return;
    }
    setInput("");
    setMessages(mess => mess.concat([{id: mess.length +1, message: message, sender: Sender.User}]))

    const apiKey = getAPIKey();
    if (!apiKey) {
      setMessages(mess => mess.concat([{id: mess.length +1, message: "API Key not set", sender: Sender.Bot}]))
      return;
    }
    
    const response = await chat(apiKey, message);
    if (!isOpenApiError(response)) {
      setMessages(mess => mess.concat([{id: mess.length +1, message: response, sender: Sender.Bot}]))
      setHistory(input.trim());
    }
    else {
      setMessages(mess => mess.concat([{id: mess.length +1, message: response.message, sender: Sender.Bot}]))
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <>
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "red",
      }}
    >
      <Box
        sx={{ flexGrow: 1, overflow: "auto", p: 2, backgroundColor: "blue" }}
      >
        {messages.map((message) => <ChatMessage key={message.id} {...message} />)}
      </Box>
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              placeholder="Type a message"
              value={input}
              onChange={handleInputChange}
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
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
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
