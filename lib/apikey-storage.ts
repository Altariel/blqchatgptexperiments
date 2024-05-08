import { IAPIKeyStorage } from "@/types/iapikeystorage";

const API_KEY_STORAGE = "chatgpt-api-key";

export class ApiKeyStorage implements IAPIKeyStorage {
  private observers: ((apiKey: string | null) => void)[] = [];
  apiKey: string | null = null;

  constructor() {
    this.apiKey = this.getAPIKey();
  }

  getAPIKey(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(API_KEY_STORAGE);
    }
    return null;
  }

  setAPIKey(newApiKey: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE, newApiKey);
      this.apiKey = newApiKey;
      this.notifyObservers(); // Notify observers when API key changes
    } else {
      throw new Error("Cannot set API key in non-browser environment");
    }
  }

  addObserver(callback: (apiKey: string | null) => void) {
    this.observers.push(callback);
  }

  removeObserver(callback: (apiKey: string | null) => void) {
    this.observers = this.observers.filter(observer => observer !== callback);
  }

  private notifyObservers() {
    this.observers.forEach(observer => observer(this.apiKey));
  }
}
