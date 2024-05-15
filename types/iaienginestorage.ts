import { AIEnginesType } from "@/lib/aiengine-storage";

export interface IAIEngineStorage {
    setAIEngines(aiEngines: AIEnginesType): void;
}