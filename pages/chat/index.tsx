import Button from '@mui/material/Button';
import React, { useContext, useEffect } from 'react';

import ChatMessage from '@/components/chatmessage';
import { AIEngineContext } from '@/lib/aiengine-provider';
import { ApiKeyContext } from '@/lib/api-key-provider';
import { ChatSessionsContext } from '@/lib/chat-sessions-provider';
import { chat, isOpenApiError } from '@/lib/openai-utils';
import { CustomRole, Message, OpenAIRole, getChatSessionId } from '@/types/chattypes';
import SendIcon from '@mui/icons-material/Send';
import { Box, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';

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
  const apiKey = useContext(ApiKeyContext).apiKey;
  const { storage, chatSessions } = useContext(ChatSessionsContext);
  const { aiEngineStorage, aiEngine } = useContext(AIEngineContext);

  useEffect(() => {
    async function fetchData() {
      const data = router.query;
      if (data.id) {
        const oldMessages = await storage.get(data.id as string);
        if (oldMessages) {
          setMessages(oldMessages.messages);
        }
      }
    }

    fetchData();
  }, [router.query, storage]);

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

    const response = await chat(apiKey, aiEngine, newMessages);
    if (!isOpenApiError(response)) {
      newMessages.push({ id: newMessages.length + 1, content: response, role: OpenAIRole.Assistant, timestamp: Date.now() });
      setMessages(newMessages);

      storage.set({
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
}
