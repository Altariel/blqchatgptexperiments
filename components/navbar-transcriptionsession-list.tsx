import { TranscribeSessionsContext } from "@/lib/transcribe-sessions-provider";
import { Button, List, ListItem, ListItemButton } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

export function NavbarTranscriptionSessionList() {
    const { storage, transcribeSessions } = useContext(TranscribeSessionsContext);

    const handleItemClick = (e: any) => {
        console.log(e.target.textContent);
    };

    const clearHistoryHandler = () => {
        void storage.clear();
    }

    return (
        <div>
            <h2>Transcription History</h2>
            <List>
                {transcribeSessions.map((transcribeSession, index) => {
                    return (
                        <ListItem key={transcribeSession.id + "-" + index} disablePadding>
                            <ListItemButton onClick={handleItemClick}>
                                <Link
                                    href={{
                                        pathname: "/audio",
                                        query: { id: transcribeSession.id }, // the data
                                    }}
                                >
                                    {transcribeSession.id}
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {transcribeSessions && (
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