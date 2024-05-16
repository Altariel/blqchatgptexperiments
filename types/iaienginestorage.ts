import { AIEnginesType } from "@/lib/aiengine-storage";

export interface IAIEnginesStorage {
    setAIEngines(aiEngines: AIEnginesType): void;
}