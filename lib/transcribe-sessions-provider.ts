import { TranscribeSession } from "@/types/chattypes";
import { IDataStorage } from "@/types/idatastorage";
import { createContext } from "react";

export const TranscribeSessionsContext = createContext<{
  storage: IDataStorage<TranscribeSession>;
  transcribeSessions: TranscribeSession[];
}>({ storage: {} as IDataStorage<TranscribeSession>, transcribeSessions: [] });
