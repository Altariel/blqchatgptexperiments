import { Drawer } from "@mui/material";
import Navbar from "./navbar";
import useSWR from 'swr';
import React from "react";
 
export default function Layout({children}: {children: JSX.Element[] | JSX.Element}) {
  return (
    <>
      <Navbar />      
      <main>{children}</main>
    </>
  );
}
