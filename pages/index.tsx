import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { getAPIKey } from "../lib/apikeyprovider";
import classes from "./index.module.css";

export default function HomePage() {
    const [apiKeyValue, setApiKeyValue] = React.useState("");
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

    useEffect(() => {
        setApiKeyValue(getAPIKey() || "");
    }, []);

    const apiKeyExists = apiKeyValue.length > 0;

    return <div className={classes.main}>        
        <button className={classNames(classes.bigButton, classes.bigButtonChat)} onClick={handleClickChat} disabled={!apiKeyExists}>
            Chat
        </button>
        <button className={classNames(classes.bigButton, classes.bigButtonTranscribe)} onClick={handleClickTranscribe} disabled={!apiKeyExists}>
            Audio
        </button>
        <button className={classNames(classes.bigButton, classes.bigButtonGenerate)} onClick={handleClickGenerate} disabled={!apiKeyExists}>
            Generate
        </button>
    </div>
}