'use client';

import { ApiKeyContext } from "@/lib/api-key-provider";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ChatIcon from '@mui/icons-material/Chat';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { Button } from "@mui/material";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useContext } from "react";
import classes from "./index.module.css";

export default function HomePage() {
    const apiKeyValue = useContext(ApiKeyContext).apiKey;
    const router = useRouter();

    function handleClickChat() {
        router.push("/chat");
    }

    function handleClickTranscribe() {
        router.push("/audio");
    }

    function handleClickGenerate() {
        router.push("/generate");
    }

    return <div className={classes.main}>
        <Button variant="contained" className={classNames(classes.bigButton)} onClick={handleClickChat} disabled={!apiKeyValue}>
            <ChatIcon/> Chat
        </Button>
        <Button  variant="contained" className={classNames(classes.bigButton)} onClick={handleClickTranscribe} disabled={!apiKeyValue}>
            <GraphicEqIcon/> Audio
        </Button>
        <Button variant="contained" className={classNames(classes.bigButton)} onClick={handleClickGenerate} disabled={!apiKeyValue}>
            <AddPhotoAlternateIcon/> Generate
        </Button>
    </div>
}