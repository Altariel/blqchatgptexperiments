import styles from "./navbar.module.css";
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import React, { useEffect } from "react";
import { getAPIKey, setAPIKey } from "../lib/apikeyprovider";
import { ApiKeyDialog } from "./apikeydialog";
import { useRouter } from "next/router";

export default function Navbar() {
    const [settingsDialogVisible, setSettingsDialogVisible] = React.useState(false);
    const [apiKeyValue, setApiKeyValue] = React.useState("");

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



    return (
      <div className={styles.navbar}>
        {settingsDialogVisible && (
          <ApiKeyDialog
            open={settingsDialogVisible}
            onClose={hideSettingsHandler}
            currentKey={apiKeyValue}
          />
        )}
        <div className={styles.leftIcons}>
          <MenuIcon className={styles.menuIcon} />
          {router.pathname != "/" && <HomeIcon onClick={homeIconHandler}/>}
        </div>
        <h1>AI Aiutami tu</h1>
        <SettingsIcon onClick={showSettingsHandler} />
      </div>
    );
}