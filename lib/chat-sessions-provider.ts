import { ChatSession } from "@/types/chattypes";
import { IDataStorage } from "@/types/idatastorage";
import { createContext } from "react";

export const ChatSessionsContext = createContext<{
  storage: IDataStorage;
  chatSessions: ChatSession[];
}>({ storage: {} as IDataStorage, chatSessions: [] });
