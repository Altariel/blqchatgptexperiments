import styles from "./navbar.module.css";
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import React, { useEffect } from "react";
import { getAPIKey, setAPIKey } from "../lib/apikeyprovider";
import { ApiKeyDialog } from "./apikeydialog";
import { useRouter } from "next/router";
import classNames from "classnames";
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { clearHistory, getHistory } from "@/lib/historyprovider";

export default function Navbar() {
    const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
    const [apiKeyValue, setApiKeyValue] = React.useState("");
    const [openDrawer, setOpenDrawer] = React.useState(false);


    const router = useRouter();


    function showSettingsHandler() {
        setSettingsDialogVisible(true);
    }

    function homeIconHandler() {
        router.push("/");        
    }


    function hideSettingsHandler(newKey: string) {
        setSettingsDialogVisible(false); 
        setAPIKey(newKey);
        setApiKeyValue(newKey);
    }

    useEffect(() => {
        setApiKeyValue(getAPIKey() || "");
    }, []);


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
      clearHistory();
    }

    const history = getHistory();

    const DrawerList = (
      <Box
        className={classNames(styles.mainDiv, styles.drawer)}
        role="presentation"
        onClick={toggleDrawer(false)}
      >
        <h2>History</h2>
        <List>
          {history?.map((text, index) => {
            return (
              <ListItem key={index + text} disablePadding>
                <ListItemButton onClick={handleItemClick}>
                  {/* <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon> */}
                  <ListItemText primary={text} />
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
              currentKey={apiKeyValue}
            />
          )}
          <div className={styles.leftIcons}>
            <MenuIcon className={classNames(styles.menuIcon, styles.button)} onClick={toggleDrawer(true)}/>
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