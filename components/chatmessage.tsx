import { Box, Paper, Typography } from "@mui/material";
import { Role, Message } from "@/types/chattypes";
export default function ChatMessage(message: Message) {
    return (<Box
                sx={{
                  display: "flex",
                  justifyContent:
                    message.role === Role.System ? "flex-start" : "flex-end",
                  mb: 2,
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    backgroundColor:
                      message.role === Role.System
                        ? "primary.light"
                        : "secondary.light",
                  }}
                >
                  <Typography variant="body1">{message.message}</Typography>
                </Paper>
              </Box>)
}