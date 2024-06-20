/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useRef } from "react";
import classes from "./index.module.css";
import { generate, isOpenApiError } from "@/lib/openai-utils";
import thinkingGif from '@/public/thinking.gif';
import { useRouter } from "next/router";
import { ApiKeyContext } from "@/lib/api-key-provider";
import { GenerateSessionsContext } from "@/lib/generate-sessions-provider";
import { AIEnginesContext } from "@/lib/aiengine-provider";
import Image from 'next/image';

export default function Generate() {
    const textarea = useRef<HTMLTextAreaElement>(null);
    const [generatedImage, setGeneratedImage] = React.useState<string>("");
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const [showBubble, setShowBubble] = React.useState(false);
    const router = useRouter();
    const apiKey = useContext(ApiKeyContext).apiKey;
    const { storage, generateSessions } = useContext(GenerateSessionsContext);
    const { aiEnginesStorage: aiEngineStorage, aiEngines: aiEngine } = useContext(AIEnginesContext);

    useEffect(() => {
        async function fetchData() {
          const data = router.query;
          if (data.id) {
            const oldImage = await storage.get(data.id as string);
            if (oldImage) {
                setGeneratedImage(oldImage.generatedImageId);
                if (textarea.current) {
                    textarea.current.value = data.id as string;
                }
            }
          }
        }
    
        fetchData();
      }, [router.query, storage]);
      
    async function generateHandler(e: React.MouseEvent<HTMLButtonElement>) {
        const description = textarea.current?.value;
        if (!description || description.length === 0 || !apiKey) {
            return;
        }
        
        setShowBubble(true);
        const response = await generate(apiKey, description, aiEngine.image);
        setShowBubble(false);
        if (!isOpenApiError(response)) {
            const newImage = "data:image/png;base64, " + response.b64_json;
            setGeneratedImage(newImage);
            storage.set({
                id: description,
                generatedImageId: newImage,
                timestamp: Date.now(),
            });
            setErrorMessage("");
        } else {
            setErrorMessage(response.message);
        }
    }

    return <div className={classes.container}>
        <h1>Generate</h1>
        <textarea className={classes.textarea} ref={textarea} placeholder="Enter the image description here" autoFocus={true} rows={5} wrap="soft" />
        <button className={classes.button} onClick={generateHandler}>Generate</button>
        {errorMessage && <div className={classes.error} >{errorMessage}</div>}
        {showBubble && <Image src={thinkingGif} alt="thinking" />}
        <div className={classes.image}>{generatedImage.length > 0 ? <img src={generatedImage} alt="Generated image" width={1024} height={1024} /> : ""}</div>
    </div>;
}