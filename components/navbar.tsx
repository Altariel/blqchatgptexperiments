import { AIEnginesContext } from "@/lib/aiengine-provider";
import { ApiKeyContext } from "@/lib/api-key-provider";
import { ChatSessionsContext } from "@/lib/chat-sessions-provider";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Drawer, List, ListItem, ListItemButton, TextField } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import styles from "./navbar.module.css";
import { ApiKeyDialog, CurrentPage, getEngineModelForPage, engineModelToString, pageToModelLabel } from "./settingsdialog";

// why this is not working?
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { AIEnginesType } from "@/lib/aiengine-storage";

//

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: 'white',
          },
          '& label.Mui-focused': {
            color: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'yellow',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'red',
            },  
            '& ': {
              color: 'white', // Change the color here
              width: '150px'
            }, 
            '& .MuiSelect-icon': {
              color: 'white', // Change the color here
            },                  
          },                         
        },
      },
    },
  },
});
export default function Navbar() {
  const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const { storage, chatSessions } = useContext(ChatSessionsContext);
  const { apiKeyStorage, apiKey: apiKeyValue } = useContext(ApiKeyContext);

  const { aiEnginesStorage, aiEngines } = useContext(AIEnginesContext);

  const router = useRouter();

  function showSettingsHandler() {
    setSettingsDialogVisible(true);
  }

  function homeIconHandler() {
    router.push("/");
  }

  // useEffect(() => {
  //   aiEngineStorageContext.setAIEngines(aiEngines);
  // }, [aiEngines]);

  function hideSettingsHandler(newKey: string, newAiEngines: AIEnginesType) {
    setSettingsDialogVisible(false);
    apiKeyStorage.setAPIKey(newKey);
    aiEnginesStorage.setAIEngines(newAiEngines);
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
  };

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

  let currentPage;
  switch (router.pathname.split("/")[1]) {
    case "chat":
      currentPage = CurrentPage.Chat;
      break;
    case "audio":
      currentPage = CurrentPage.Transcribe;
      break;
    case "generate":
      currentPage = CurrentPage.Image;
      break;
    default:
      currentPage = CurrentPage.Home;
      break;
  }

  const modelLabel = pageToModelLabel(currentPage);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.navbar}>
        {settingsDialogVisible && (
          <ApiKeyDialog
            open={settingsDialogVisible}
            onClose={hideSettingsHandler}
            currentKey={apiKeyValue || ""}
            currentAiEnginesModel={aiEngines}
          />
        )}
        <div className={styles.box}>
          <span>
            <MenuIcon
              className={classNames(styles.menuIcon, styles.button)}
              onClick={toggleDrawer(true)}
            />
            {router.pathname != "/" && (
              <HomeIcon onClick={homeIconHandler} className={styles.button} />
            )}
          </span>
        </div>
        <div className={styles.box}>
          <span>
            <h1>AI Aiutami tu {getPageName()}</h1>
          </span>
        </div>
        <div className={styles.box_first_last}>
          <span className={styles.rightIcons}>
            {currentPage !== CurrentPage.Home && (
              <ThemeProvider theme={theme}>
                <TextField
                  id="select-ai-engine"
                  value={engineModelToString(
                    getEngineModelForPage(aiEngines, currentPage)
                  )}
                  label={modelLabel}
                  className={styles.combo}
                ></TextField>
              </ThemeProvider>
            )}
            <SettingsIcon
              onClick={showSettingsHandler}
              className={styles.button}
            />
          </span>
        </div>
      </div>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}