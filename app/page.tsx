'use client';

import React, { Fragment } from "react";
import Link from "next/link";
import classes from "./page.module.css";

export default function HomePage() {
    return <div className={classes.main}>
        <Link href="/chat" >Chat</Link>
        <Link href="/audio" >Audio</Link>
    </div>
}