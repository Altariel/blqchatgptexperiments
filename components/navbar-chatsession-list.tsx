import { ChatSessionsContext } from "@/lib/chat-sessions-provider";
import { Button, List, ListItem, ListItemButton } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

export function NavbarChatSessionList() {
    const { storage, chatSessions } = useContext(ChatSessionsContext);

    const handleItemClick = (e: any) => {
        console.log(e.target.textContent);
    };

    const clearHistoryHandler = () => {
        void storage.clear();
    }

    return (
        <div>
            <h2>Chat History</h2>
            <List>
                {chatSessions.map((chatSession, index) => {
                    return (
                        <ListItem key={chatSession.id + "-" + index} disablePadding>
                            <ListItemButton onClick={handleItemClick}>
                                <Link
                                    href={{
                                        pathname: "/chat",
                                        query: { id: chatSession.id }, // the data
                                    }}
                                >
                                    {chatSession.id}
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {chatSessions && (
                <Button
                    size="large"
                    color="primary"
                    variant="contained"
                    onClick={clearHistoryHandler}
                >
                    Clear History
                </Button>
            )}
        </div>
    )
}