import { AIEngineContext } from "@/lib/aiengine-provider";
import { AIEngineModel } from "@/lib/aiengine-storage";
import { ApiKeyContext } from "@/lib/api-key-provider";
import { ChatSessionsContext } from "@/lib/chat-sessions-provider";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Drawer, List, ListItem, ListItemButton } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import styles from "./navbar.module.css";
import { ApiKeyDialog } from "./settingsdialog";

export default function Navbar() {
  const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const { storage, chatSessions } = useContext(ChatSessionsContext);
  const { apiKeyStorage, apiKey: apiKeyValue } = useContext(ApiKeyContext);

  const { aiEngineStorage, aiEngine } = useContext(AIEngineContext);

  const router = useRouter();

  function showSettingsHandler() {
    setSettingsDialogVisible(true);
  }

  function homeIconHandler() {
    router.push("/");
  }

  function hideSettingsHandler(newKey: string, newAiEngine: AIEngineModel) {
    setSettingsDialogVisible(false);
    apiKeyStorage.setAPIKey(newKey);
    aiEngineStorage.setAIEngine(newAiEngine);
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
    void storage.clear();
  }

  const DrawerList = (
    <Box
      className={classNames(styles.mainDiv, styles.drawer)}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <h2>History</h2>
      <List>
        {chatSessions?.map((chatSession, index) => {
          return (
            <ListItem key={chatSession.id + "-" + index} disablePadding>
              <ListItemButton onClick={handleItemClick}>
                <Link
                  href={{
                    pathname: "/chat",
                    query: { id: chatSession.id }, // the data
                  }}
                >
                  {chatSession.id}
                </Link>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {chatSessions && (
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
            currentAiEngineModel={aiEngine}
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