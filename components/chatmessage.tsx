import styles from "./chatmessage.module.css";
import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Role, Message, OpenAIRole } from "@/types/chattypes";
import { MuiMarkdown, getOverrides } from 'mui-markdown';
export default function ChatMessage(message: Message) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent:
            message.role === OpenAIRole.User ? "flex-end" : "flex-start",
          mb: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            backgroundColor:
              message.role === OpenAIRole.User
                ? "secondary.light"
                : "primary.light",
          }}
        >
          <Typography>
            <MuiMarkdown
            overrides={{
              ...getOverrides({}), // This will keep the other default overrides.
              ul: {
                props: {
                  style: {  paddingLeft: "1em"  },
                },
              },
              ol: {
                props: {
                  style: {  paddingLeft: "1.5em"  },
                },
              },
            }}
          >
             {message.content}</MuiMarkdown>
          </Typography>
        </Paper>
      </Box>
    );
}