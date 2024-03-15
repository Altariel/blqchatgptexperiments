import { Drawer } from "@mui/material";
import Navbar from "./navbar";
import React from "react";
import styles from "./layout.module.css";
 
export default function Layout({children}: {children: JSX.Element[] | JSX.Element}) {
  return (
    <>
      <main className={styles.main}>
        <Navbar />
        {children}
      </main>
    </>
  );
}
