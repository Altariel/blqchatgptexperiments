import { IAIEnginesStorage as IAIEnginesStorage } from "@/types/iaienginestorage";
import { IAPIKeyStorage } from "@/types/iapikeystorage";

const AI_ENGINES_STORAGE = "ai-engines";

export enum AIChatEngineModel {
  Gpt3_5 = "3_5", // chat
  Gpt4 = "4", // chat 
}

export enum AITranscribeEngineModel {
  Whisper_1 = "whisper-1", // transcribe
}

export enum AIImageEngineModel { 
  Dall_E_3 = "dall-e-3", // image generation
}

export type AIEnginesType = {
  chat: AIChatEngineModel;
  transcribe: AITranscribeEngineModel;
  image: AIImageEngineModel;
};

export const DefaultEngines = {
  chat: AIChatEngineModel.Gpt3_5,
  transcribe: AITranscribeEngineModel.Whisper_1,
  image: AIImageEngineModel.Dall_E_3,
};

export function getAIChatEngineModelString(aiEngine: AIChatEngineModel) {
  switch (aiEngine) {
    case AIChatEngineModel.Gpt3_5:
      return "gpt-3.5-turbo-0125";
    case AIChatEngineModel.Gpt4:
      return "gpt-4-0125-preview";
  }    
}

export function getAITranscribeEngineModel(aiEngine: AITranscribeEngineModel) {
  switch (aiEngine) {
    case AITranscribeEngineModel.Whisper_1:
      return "whisper-1";
  }
}

export function getAIImageEngineModel(aiEngine: AIImageEngineModel) {
  switch (aiEngine) {
    case AIImageEngineModel.Dall_E_3:
      return "dall-e-3";
  }
}

function isAIEnginesType(obj: any): obj is AIEnginesType {
  // Replace 'prop1', 'prop2', etc. with actual properties of AIEnginesType
  return obj && typeof obj === 'object' && 'chat' in obj && 'transcribe' in obj && 'image' in obj;
}
export class AIEnginesStorage implements IAIEnginesStorage {
  private observers: ((aiEngins: AIEnginesType) => void)[] = [];
  aiEngines: AIEnginesType = DefaultEngines;

  constructor() {
    this.aiEngines = this.getAIEngines();
  }

  getAIEngines(): AIEnginesType {
    if (typeof window !== "undefined") {
      try {
        const savedEngine = JSON.parse(
          localStorage.getItem(AI_ENGINES_STORAGE) ?? ""
        ) as AIEnginesType;
        if (isAIEnginesType(savedEngine)) {
          return savedEngine;
        }
      } catch (e) {
        return DefaultEngines;
      }
    }
    return DefaultEngines;
  }

  setAIEngines(newAiEngines: AIEnginesType) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AI_ENGINES_STORAGE, JSON.stringify(newAiEngines));
      this.aiEngines = newAiEngines;
      this.notifyObservers(); // Notify observers when API key changes
    } else {
      throw new Error("Cannot set AI Engine in non-browser environment");
    }
  }

  // Register an observer callback
  addObserver(callback: (aiEngines: AIEnginesType) => void) {
    this.observers.push(callback);
  }

  // Remove an observer callback
  removeObserver(callback: (aiEnginesModel: AIEnginesType) => void) {
    this.observers = this.observers.filter((observer) => observer !== callback);
  }

  // Notify all observers
  private notifyObservers() {
    this.observers.forEach((observer) => observer(this.aiEngines));
  }
}
