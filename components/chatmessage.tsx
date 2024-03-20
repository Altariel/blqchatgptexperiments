import { Box, Paper, Typography } from "@mui/material";
import { Role, Message, OpenAIRole } from "@/types/chattypes";
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
          <Typography variant="body1">{message.content}</Typography>
        </Paper>
      </Box>
    );
}