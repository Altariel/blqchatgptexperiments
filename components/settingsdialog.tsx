import { AIChatEngineModel, AIEnginesType, AIImageEngineModel, AITranscribeEngineModel } from '@/lib/aiengine-storage';
import { MenuItem, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React from "react";
import classes from "./settingsdialog.module.css";

export enum CurrentPage {
  Chat = "chat",
  Transcribe = "audio",
  Image = "image",
  Home = "home",
}

export type ApiKeyDialogProps = {
    currentKey: string;
    currentAiEnginesModel: AIEnginesType,
    onClose: (newKey: string, aiEngines: AIEnginesType) => void;
    open: boolean;
}

export function pageToModelLabel(page: CurrentPage): string {
  switch (page) {
    case CurrentPage.Chat:
      return "Chat Model";
    case CurrentPage.Transcribe:
      return "Transcribe Model";
    case CurrentPage.Image:
      return "Image Model";
    default:
      return "";
  }
}

export function getEngineModelForPage(aiEngines: AIEnginesType, currentPage: CurrentPage): AIChatEngineModel | AIImageEngineModel | AITranscribeEngineModel
{
  switch (currentPage) {
    case CurrentPage.Chat:
      return aiEngines.chat;
    case CurrentPage.Transcribe:
      return aiEngines.transcribe;
    case CurrentPage.Image:
      return aiEngines.image;
    default:
      return aiEngines.chat;
  }
}

export function engineModelToString(model: AIChatEngineModel | AITranscribeEngineModel | AIImageEngineModel): string {
  switch (model) {
    case AIChatEngineModel.Gpt3_5:
      return "GPT 3.5 Turbo";
    case AIChatEngineModel.Gpt4:
      return "GPT 4";
    case AITranscribeEngineModel.Whisper_1:
      return "Whisper 1";
    case AIImageEngineModel.Dall_E_3:
      return "Dall-E 3";
  }
}


export function ApiKeyDialog(props: ApiKeyDialogProps) {
    const [isEditing, setIsEditing] = React.useState(props.currentKey.length === 0);
    const [key, setyKey] = React.useState(props.currentKey);
    const [aiEngines, setAiEngines] = React.useState<AIEnginesType>(props.currentAiEnginesModel);

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
        props.onClose(key, aiEngines);
    }    

  function updateEngineValues(val: string, currentPage: CurrentPage, currEngines: AIEnginesType): AIEnginesType {
    switch (currentPage) {
      case CurrentPage.Chat:
        return { ...currEngines, chat: val as AIChatEngineModel };
      case CurrentPage.Transcribe:
        return { ...currEngines, transcribe: val as AITranscribeEngineModel }
      case CurrentPage.Image:
        return { ...currEngines, image: val as AIImageEngineModel }
      default:
        throw new Error("Invalid page");
    }
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
          <div className={classes.buttons}>
            <TextField
              id="select-chat-ai-engine"
              value={getEngineModelForPage(aiEngines, CurrentPage.Chat)}
              label={pageToModelLabel(CurrentPage.Chat)}
              onChange={(e) =>
                setAiEngines(
                  updateEngineValues(
                    e.target.value,
                    CurrentPage.Chat,
                    aiEngines
                  )
                )
              }
              className={classes.combo}
              select
            >
              <MenuItem value={AIChatEngineModel.Gpt3_5}>
                {engineModelToString(AIChatEngineModel.Gpt3_5)}
              </MenuItem>
              <MenuItem value={AIChatEngineModel.Gpt4}>
                {engineModelToString(AIChatEngineModel.Gpt4)}
              </MenuItem>
            </TextField>
            <TextField
              id="select-atranscribe-ai-engine"
              value={getEngineModelForPage(aiEngines, CurrentPage.Transcribe)}
              label={pageToModelLabel(CurrentPage.Transcribe)}
              onChange={(e) =>
                setAiEngines(
                  updateEngineValues(
                    e.target.value,
                    CurrentPage.Transcribe,
                    aiEngines
                  )
                )
              }
              className={classes.combo}
              select
            >
              <MenuItem value={AITranscribeEngineModel.Whisper_1}>
                {engineModelToString(AITranscribeEngineModel.Whisper_1)}
              </MenuItem>
            </TextField>
            <TextField
              id="select-image-ai-engine"
              value={getEngineModelForPage(aiEngines, CurrentPage.Image)}
              label={pageToModelLabel(CurrentPage.Image)}
              onChange={(e) =>
                setAiEngines(
                  updateEngineValues(
                    e.target.value,
                    CurrentPage.Image,
                    aiEngines
                  )
                )
              }
              className={classes.combo}
              select
            >
              <MenuItem value={AIImageEngineModel.Dall_E_3}>
                {engineModelToString(AIImageEngineModel.Dall_E_3)}
              </MenuItem>
            </TextField>
          </div>
        </div>
      </Dialog>
    );
}