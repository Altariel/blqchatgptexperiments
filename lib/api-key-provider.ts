import { IAPIKeyStorage } from "@/types/iapikeystorage";
import { createContext } from "react";

export const ApiKeyContext = createContext<{
  apiKeyStorage: IAPIKeyStorage;
  apiKey: string | null;
}>({ apiKeyStorage: {} as IAPIKeyStorage, apiKey: null });
