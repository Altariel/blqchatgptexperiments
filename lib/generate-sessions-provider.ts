import { GenerateSession } from "@/types/chattypes";
import { IDataStorage } from "@/types/idatastorage";
import { createContext } from "react";

export const GenerateSessionsContext = createContext<{
  storage: IDataStorage<GenerateSession>;
  generateSessions: GenerateSession[];
}>({ storage: {} as IDataStorage<GenerateSession>, generateSessions: [] });
