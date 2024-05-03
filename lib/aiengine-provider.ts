import { IAIEngineStorage } from "@/types/iaienginestorage";
import { AIEngineModel } from "./aiengine-storage";
import { createContext } from "react";

export const AIEngineContext = createContext<{
  aiEngineStorage: IAIEngineStorage;
  aiEngine: AIEngineModel;
}>({ aiEngineStorage: {} as IAIEngineStorage, aiEngine: AIEngineModel.Gpt3_5 });
