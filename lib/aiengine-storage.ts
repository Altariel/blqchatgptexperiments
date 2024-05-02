import { IAIEngineStorage } from "@/types/iaienginestorage";
import { IAPIKeyStorage } from "@/types/iapikeystorage";

const AI_ENGINE_STORAGE = "chatgpt-ai-engine";

export enum AIEngineModel {
  Gpt3_5 = "3_5",
  Gpt4 = "4",
}

export function getAIEngineModelString(aiEngine: AIEngineModel) {
  switch (aiEngine) {
    case AIEngineModel.Gpt3_5:
      return "gpt-3.5-turbo-0125";
    case AIEngineModel.Gpt4:
      return "gpt-4-0125-preview";
  }
}

export class AIEngineStorage implements IAIEngineStorage {
  private observers: ((aiEngine: AIEngineModel) => void)[] = [];
  aiEngine: AIEngineModel = AIEngineModel.Gpt3_5;

  constructor() {
    this.aiEngine = this.getAIEngine();
  }

  getAIEngine(): AIEngineModel {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AI_ENGINE_STORAGE) as AIEngineModel;
    }
    return AIEngineModel.Gpt3_5;
  }

  setAIEngine(newAiEngine: AIEngineModel) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AI_ENGINE_STORAGE, newAiEngine);
      this.aiEngine = newAiEngine;
      this.notifyObservers(); // Notify observers when API key changes
    } else {
      throw new Error("Cannot set AI Engine in non-browser environment");
    }
  }

  // Register an observer callback
  addObserver(callback: (aiEngine: AIEngineModel) => void) {
    this.observers.push(callback);
  }

  // Remove an observer callback
  removeObserver(callback: (aiEngineModel: AIEngineModel) => void) {
    this.observers = this.observers.filter((observer) => observer !== callback);
  }

  // Notify all observers
  private notifyObservers() {
    this.observers.forEach((observer) => observer(this.aiEngine));
  }
}
