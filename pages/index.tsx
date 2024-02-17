import React, { Fragment } from "react";
import Link from "next/link";
import classes from "./index.module.css";
import classNames from "classnames";
import { useRouter } from "next/router";

export default function HomePage() {
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
        <h1 className={classes.h1}>AI Aiutami tu</h1>
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