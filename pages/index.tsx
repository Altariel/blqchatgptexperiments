'use client';

import classNames from "classnames";
import { useRouter } from "next/router";
import { useContext } from "react";
import classes from "./index.module.css";
import { ApiKeyContext } from "@/lib/api-key-provider";

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
        <button className={classNames(classes.bigButton, classes.bigButtonChat)} onClick={handleClickChat} disabled={!apiKeyValue}>
            Chat
        </button>
        <button className={classNames(classes.bigButton, classes.bigButtonTranscribe)} onClick={handleClickTranscribe} disabled={!apiKeyValue}>
            Audio
        </button>
        <button className={classNames(classes.bigButton, classes.bigButtonGenerate)} onClick={handleClickGenerate} disabled={!apiKeyValue}>
            Generate
        </button>
    </div>
}