import { ApiKeyStorageContext } from "@/lib/apikey-storage-provider";
import { ApiKeyValueContext } from "@/lib/apikey-value-provider";
import { ChatSessionsValueContext } from "@/lib/chat-sessions-value-provider";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Drawer, List, ListItem, ListItemButton } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { ApiKeyDialog } from "./apikeydialog";
import styles from "./navbar.module.css";
import { DataStorageContext } from "@/lib/data-storage-provider";

export default function Navbar() {
  const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
  const apiKeyValue = useContext(ApiKeyValueContext);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  
  const dataStorageContext = useContext(DataStorageContext);
  const history = useContext(ChatSessionsValueContext);
  const apiKeyStorageContext = useContext(ApiKeyStorageContext);  

  const router = useRouter();

  function showSettingsHandler() {
    setSettingsDialogVisible(true);
  }

  function homeIconHandler() {
    router.push("/");
  }

  function hideSettingsHandler(newKey: string) {
    setSettingsDialogVisible(false);
    apiKeyStorageContext.setAPIKey(newKey);
  }

  function getPageName() {
    const pathComponents = router.pathname.split("/");
    const str = pathComponents[pathComponents.length - 1];
    if (str.length > 0) {
      return " - " + str.charAt(0).toUpperCase() + str.slice(1);
    }
    return undefined;
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const handleItemClick = (e: any) => {
    console.log(e.target.textContent);
  }

  const clearHistoryHandler = () => {
    void dataStorageContext.clear();
  }

  const DrawerList = (
    <Box
      className={classNames(styles.mainDiv, styles.drawer)}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <h2>History</h2>
      <List>
        {history?.map((chatSession, index) => {
          return (
            <ListItem key={chatSession.id} disablePadding>
              <ListItemButton onClick={handleItemClick}>
                <Link
                  href={{
                    pathname: "/chat",
                    query: {id: chatSession.id}, // the data
                  }}
                >
                  {chatSession.id}
                </Link>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {history && (
        <Button
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          onClick={clearHistoryHandler}
        >
          Clear History
        </Button>
      )}
    </Box>
  );

  return (
    <div className={styles.mainDiv}>
      <div className={styles.navbar}>
        {settingsDialogVisible && (
          <ApiKeyDialog
            open={settingsDialogVisible}
            onClose={hideSettingsHandler}
            currentKey={apiKeyValue || ""}
          />
        )}
        <div className={styles.leftIcons}>
          <MenuIcon className={classNames(styles.menuIcon, styles.button)} onClick={toggleDrawer(true)} />
          {router.pathname != "/" && (
            <HomeIcon onClick={homeIconHandler} className={styles.button} />
          )}
        </div>
        <h1>AI Aiutami tu {getPageName()}</h1>
        <SettingsIcon
          onClick={showSettingsHandler}
          className={styles.button}
        />
      </div>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}