import React, { useRef } from "react";
import classes from "./index.module.css";
import { getAPIKey } from "@/lib/apikeyprovider";

export default function Generate() {
    const input = useRef<HTMLInputElement>(null);

    function generateHandler(e: React.MouseEvent<HTMLButtonElement>) {
        const apikey = getAPIKey();
        const response = await openai.createImage({
            model: "dall-e-3",
            prompt: "a white siamese cat",
            n: 1,
            size: "1024x1024",
          });
          image_url = response.data.data[0].url;
    }


    return <div>
        <div className={classes.container}>Generate</div>
        <input type="text" className={classes.input} placeholder="Enter the image description here" />
        <button className={classes.button} onClick={generateHandler}>Generate</button>
    </div>;
}