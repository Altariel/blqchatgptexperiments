import { AIEngineModel } from "@/lib/aiengine-storage";
import { AIEngineStorageContext } from "@/lib/aiengine-storage-provider";
import { AIEngineValueContext } from "@/lib/aiengine-value-provider";
import { ApiKeyStorageContext } from "@/lib/apikey-storage-provider";
import { ApiKeyValueContext } from "@/lib/apikey-value-provider";
import { ChatSessionsValueContext } from "@/lib/chat-sessions-value-provider";
import { DataStorageContext } from "@/lib/data-storage-provider";
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, Drawer, List, ListItem, ListItemButton, MenuItem, TextField, styled } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import styles from "./navbar.module.css";
import { ApiKeyDialog } from "./settingsdialog";

// why this is not working?
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

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


// const CssTextField = styled(TextField)({
//   root: {
//     '& label': {
//       color: 'red',
//     },
//     '& label.Mui-focused': {
//       color: 'white',
//     },
//     '& .MuiInput-underline:after': {
//       borderBottomColor: 'yellow',
//     },
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: 'white',
//       },
//       '&:hover fieldset': {
//         borderColor: 'white',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: 'yellow',
//       },
//       '& input': {
//         color: 'blue', // Change the color here
//       },
//     },
//   },
// });

export default function Navbar() {
  const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
  const apiKeyValue = useContext(ApiKeyValueContext);
  const aiEngineModelValue = useContext(AIEngineValueContext);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [aiEngine, setAiEngine] = React.useState<AIEngineModel>(aiEngineModelValue);

  
  const dataStorageContext = useContext(DataStorageContext);
  const history = useContext(ChatSessionsValueContext);
  const apiKeyStorageContext = useContext(ApiKeyStorageContext);  
  const aiEngineStorageContext = useContext(AIEngineStorageContext);  

  const router = useRouter();

  function showSettingsHandler() {
    setSettingsDialogVisible(true);
  }

  function homeIconHandler() {
    router.push("/");
  }

  useEffect(() => {
    aiEngineStorageContext.setAIEngine(aiEngine);    
  }, [aiEngine]);

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
    <ThemeProvider theme={theme}>
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
        <div className={styles.box}>
          <span className={styles.rightIcons}>          
            <TextField
            id="select-ai-engine"
            value={aiEngine}
            label="AI Engine Model"
            onChange={(e) => setAiEngine(e.target.value as AIEngineModel)}
            className={styles.combo}
            select
          >
            <MenuItem value={AIEngineModel.Gpt3_5}>GPT 3.5 Turbo</MenuItem>
            <MenuItem value={AIEngineModel.Gpt4}>GPT 4</MenuItem>
          </TextField>
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
    </ThemeProvider>
  );
}