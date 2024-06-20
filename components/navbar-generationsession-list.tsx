import { GenerateSessionsContext } from "@/lib/generate-sessions-provider";
import { TranscribeSessionsContext } from "@/lib/transcribe-sessions-provider";
import { Button, List, ListItem, ListItemButton } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

export function NavbarGenerateSessionList() {
    const { storage, generateSessions } = useContext(GenerateSessionsContext);

    const handleItemClick = (e: any) => {
        //TODO
        console.log(e.target.textContent);
    };

    const clearHistoryHandler = () => {
        void storage.clear();
    }

    return (
        <div>
            <h2>Transcription History</h2>
            <List>
                {generateSessions.map((generateSession, index) => {
                    return (
                        <ListItem key={generateSession.id + "-" + index} disablePadding>
                            <ListItemButton onClick={handleItemClick}>
                                <Link
                                    href={{
                                        pathname: "/generate",
                                        query: { id: generateSession.id }, // the data
                                    }}
                                >
                                    {generateSession.id}
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {generateSessions && (
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