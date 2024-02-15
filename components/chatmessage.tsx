import { Box, Paper, Typography } from "@mui/material";
import { Sender, SentMessage } from "@/types/chattypes";
export default function ChatMessage(message: SentMessage) {
    return (<Box
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === Sender.Bot ? "flex-start" : "flex-end",
                  mb: 2,
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    backgroundColor:
                      message.sender === Sender.Bot
                        ? "primary.light"
                        : "secondary.light",
                  }}
                >
                  <Typography variant="body1">{message.message}</Typography>
                </Paper>
              </Box>)
}