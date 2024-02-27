import React, { Fragment } from "react";
import Link from "next/link";
import classes from "./index.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";
import SettingsIcon from '@mui/icons-material/Settings';
import { ApiKeyDialog } from "@/components/apikeydialog";

export default function HomePage() {
    const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
    const router = useRouter();

    function showSettingsHandler() {
        setSettingsDialogVisible(true);
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

    return <div className={classes.main}>
        <ApiKeyDialog open={settingsDialogVisible} onClose={() => { setSettingsDialogVisible(false) }} currentKey="" />
        <h1 className={classes.h1}>AI Aiutami tu</h1>
        <div className={classes.icon} onClick={showSettingsHandler}>
            <SettingsIcon />
        </div>
        <div className={classNames(classes.bigButton, classes.bigButtonChat)} onClick={handleClickChat}>
            Chat
        </div>
        <div className={classNames(classes.bigButton, classes.bigButtonTranscribe)} onClick={handleClickTranscribe}>
            Audio
        </div>
        <div className={classNames(classes.bigButton, classes.bigButtonGenerate)} onClick={handleClickGenerate}>
            Generate
        </div>
    </div>
}