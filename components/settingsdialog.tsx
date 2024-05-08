import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import React from "react"
import classes from "./settingsdialog.module.css";
import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { AIEngineModel } from '@/lib/aiengine-storage';

export type ApiKeyDialogProps = {
    currentKey: string;
    currentAiEngineModel: AIEngineModel,
    onClose: (newKey: string, aiEngine: AIEngineModel) => void;
    open: boolean;
}

export function ApiKeyDialog(props: ApiKeyDialogProps) {
    const [isEditing, setIsEditing] = React.useState(props.currentKey.length === 0);
    const [key, setyKey] = React.useState(props.currentKey);
    const [aiEngine, setAiEngine] = React.useState<AIEngineModel>(props.currentAiEngineModel);

    const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setyKey("");
    }

    const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isEditing) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setyKey(e.target.value);
    }

    const onClose = () => {
        props.onClose(key, aiEngine);
    }    

    return (
      <Dialog onClose={onClose} open={props.open}>
        <DialogTitle>Settings</DialogTitle>
        <hr />
        <div className={classes.form}>
          <label htmlFor="api-key-input">API Key: </label>
          {isEditing && (
            <input
              autoFocus
              id="api-key-input"
              type="text"
              placeholder="Paste your API Key here"
              value={key}
              onChange={handleInputChange}
            />
          )}
          {!isEditing && key}

          <div className={classes.buttons}>
            <button type="button" onClick={onDelete} disabled={isEditing}>
              Delete
            </button>
            <button type="submit" onClick={onEdit}>
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>         
        </div>
      </Dialog>
    );
}