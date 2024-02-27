import React, { Fragment, useEffect } from "react";
import Link from "next/link";
import classes from "./index.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";
import SettingsIcon from '@mui/icons-material/Settings';
import { ApiKeyDialog } from "@/components/apikeydialog";
import { getAPIKey, setAPIKey } from "../lib/apikeyprovider";

export default function HomePage() {
    const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
    const [apiKeyValue, setApiKeyValue] = React.useState("");
    const router = useRouter();

    function showSettingsHandler() {
        setSettingsDialogVisible(true);
    }

    function hideSettingsHandler(newKey: string) {
        setSettingsDialogVisible(false); 
        setAPIKey(newKey);
        setApiKeyValue(newKey);
    }

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
        <ApiKeyDialog open={settingsDialogVisible} onClose={hideSettingsHandler} currentKey={apiKeyValue} />
        <h1 className={classes.h1}>AI Aiutami tu</h1>
        <div className={classes.icon} onClick={showSettingsHandler}>
            <SettingsIcon />
        </div>
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