import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import classes from './index.module.css';
import styles from "@/styles/Home.module.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <div className={classes.main}>
    <Link href="/chat" >Chat</Link>
    <Link href="/audio" >Audio</Link>
  </div>
}
