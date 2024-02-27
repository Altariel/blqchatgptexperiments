import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import React from "react"
import classes from "./apikeydialog.module.css";
export type ApiKeyDialogProps = {
    currentKey: string;
    onClose: (newKey:string) => void;
    open: boolean;
}

export function ApiKeyDialog(props: ApiKeyDialogProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [key, setyKey] = React.useState(props.currentKey);

    const startEditing = props.currentKey.length === 0;

    const onDelete = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setyKey("");
    }

    const onEdit = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEditing(true);
    }

    const onClose = () => {
        props.onClose(key);
    }

    return (
        <Dialog onClose={onClose} open={props.open}>
        <DialogTitle>Enter your ChatGPT API key</DialogTitle>
        <hr/>
        <div className={classes.form}>
            <label htmlFor="api-key-input">API Key</label>
            {(startEditing || isEditing) && <input id="api-key-input" type="text" placeholder="Paste your API Key here" />}
            {!isEditing && key}
            <div className={classes.buttons}>
                <button type="button" onClick={onDelete} disabled={isEditing}>Delete</button>
                <button type="submit" onClick={onEdit}>Edit</button>
            </div>
        </div>
      </Dialog>
    )
}