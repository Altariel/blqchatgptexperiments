/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";
import classes from "./index.module.css";
import { getAPIKey } from "@/lib/apikeyprovider";
import { generate, isOpenApiError } from "@/lib/openai-utils";

export default function Generate() {
    const textarea = useRef<HTMLTextAreaElement>(null);
    const [generatedImage, setGeneratedImage] = React.useState<string>("");
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    async function generateHandler(e: React.MouseEvent<HTMLButtonElement>) {
        const apikey = getAPIKey();
        const description = textarea.current?.value;
        if (description && apikey) {
            const response = await generate(apikey, description);
            if (!isOpenApiError(response)) {
                setGeneratedImage(response.b64_json);
            } else {
                setErrorMessage(response.message);
            }
        }
    }

    return <div className={classes.container}>
        <h1>Generate</h1>
        <button className={classes.button} onClick={generateHandler}>Generate</button>
        <textarea className={classes.textarea} ref={textarea} placeholder="Enter the image description here" autoFocus rows={5} wrap="soft" />
        <img src={generatedImage} alt="Generated image" width={1024} height={1024} />
        {errorMessage}
    </div>;
}