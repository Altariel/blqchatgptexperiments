import { AIEngineModel } from "@/lib/aiengine-storage";

export interface IAIEngineStorage {
    setAIEngine(aiEngine: AIEngineModel): void;
}