import { IAIEnginesStorage } from "@/types/iaienginestorage";
import { AIEnginesType, DefaultEngines } from "./aiengine-storage";
import { createContext } from "react";

export const AIEnginesContext = createContext<{
  aiEnginesStorage: IAIEnginesStorage;
  aiEngines: AIEnginesType;
}>({ aiEnginesStorage: {} as IAIEnginesStorage, aiEngines: DefaultEngines });
