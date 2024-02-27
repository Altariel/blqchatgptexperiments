import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import React, { useRef } from "react"
import classes from "./apikeydialog.module.css";
export type ApiKeyDialogProps = {
    currentKey: string;
    onClose: (newKey: string) => void;
    open: boolean;
}

export function ApiKeyDialog(props: ApiKeyDialogProps) {
    const [isEditing, setIsEditing] = React.useState(props.currentKey.length === 0);
    const [key, setyKey] = React.useState(props.currentKey);

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
        props.onClose(key);
    }

    return (
        <Dialog onClose={onClose} open={props.open}>
            <DialogTitle>Enter your ChatGPT API key</DialogTitle>
            <hr />
            <div className={classes.form}>
                <label htmlFor="api-key-input">API Key: </label>
                {isEditing && <input id="api-key-input" type="text" placeholder="Paste your API Key here" value={key} onChange={handleInputChange} />}
                {!isEditing && key}
                <div className={classes.buttons}>
                    <button type="button" onClick={onDelete} disabled={isEditing}>Delete</button>
                    <button type="submit" onClick={onEdit}>{isEditing ? "Done" : "Edit"}</button>
                </div>
            </div>
        </Dialog>
    )
}