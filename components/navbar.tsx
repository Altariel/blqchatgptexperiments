import { AIEngineModel } from "@/lib/aiengine-storage";
import { AIEngineStorageContext } from "@/lib/aiengine-storage-provider";
import { ApiKeyStorageContext } from "@/lib/apikey-storage-provider";
import { ApiKeyValueContext } from "@/lib/apikey-value-provider";
import { DataStorageContext } from "@/lib/data-storage-provider";
import { ChatSession } from "@/types/chattypes";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Drawer, List, ListItem, ListItemButton } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { ApiKeyDialog } from "./settingsdialog";
import styles from "./navbar.module.css";
import { AIEngineValueContext } from "@/lib/aiengine-value-provider";

export default function Navbar() {
  const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
  const apiKeyValue = useContext(ApiKeyValueContext);
  const aiEngineModelValue = useContext(AIEngineValueContext);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [history, setHistory] = React.useState<ChatSession[]>([]);

  const dataStorageContext = useContext(DataStorageContext);
  const apiKeyStorageContext = useContext(ApiKeyStorageContext);  
  const aiEngineStorageContext = useContext(AIEngineStorageContext);  

  const router = useRouter();

  function showSettingsHandler() {
    setSettingsDialogVisible(true);
  }

  function homeIconHandler() {
    router.push("/");
  }

  function hideSettingsHandler(newKey: string, newAiEngine: AIEngineModel) {
    setSettingsDialogVisible(false);
    apiKeyStorageContext.setAPIKey(newKey);

    //
    aiEngineStorageContext.setAIEngine(newAiEngine);
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

  useEffect(() => {
    const setHistoryFunc = async () => {
      setHistory(await dataStorageContext.getAll());
    };
    setHistoryFunc();
  }, [dataStorageContext]);

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
            <ListItem key={chatSession.id + "-" + index} disablePadding>
              <ListItemButton onClick={handleItemClick}>
                {/* <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon> */}
                <Link
                  href={{
                    pathname: "/chat",
                    query: {
                      text: chatSession.messages
                        ? chatSession.messages[0].id
                        : "",
                    }, // the data
                  }}
                >
                  {chatSession.messages ? chatSession.messages[0].content : ""}
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
            currentAiEngineModel={aiEngineModelValue}
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