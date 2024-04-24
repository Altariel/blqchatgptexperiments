import { ChatSession } from "@/types/chattypes";
import { IDataStorage } from "@/types/idatastorage";

const HISTORY_STORAGE = "chatgpt-history";

export class LocalDataStorage implements IDataStorage {
  private observers: (() => void)[] = [];
  allData: Map<string, ChatSession> = new Map();

  async ensureDataIsAvailable() {
    const data = localStorage.getItem(HISTORY_STORAGE);
    if (data) {
      const data2 = JSON.parse(data);
      if (!data2 || Object.keys(data2).length === 0) {
        this.allData = new Map();
      } else {
        this.allData = new Map(Object.entries(data2));
      }
    }
  }

  async getAll() {
    this.ensureDataIsAvailable();
    return Array.from(this.allData.values());
  }

  async get(id: string) {
    this.ensureDataIsAvailable();
    return this.allData.get(id);
  }

  async set(value: any) {
    this.ensureDataIsAvailable();
    this.allData.set(value.id, value);

    const obj = Object.fromEntries(this.allData);
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(obj));
    this.notifyObservers();
  }

  async remove(id: string) {
    this.ensureDataIsAvailable();
    this.allData.delete(id);

    const obj = Object.fromEntries(this.allData);
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(obj));
    this.notifyObservers();
  }

  async clear() {
    this.allData.clear();

    const obj = Object.fromEntries(this.allData);
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(obj));
    this.notifyObservers();
  }

  addObserver(callback: () => void) {
    this.observers.push(callback);
  }

  removeObserver(callback: () => void) {
    this.observers = this.observers.filter((observer) => observer !== callback);
  }

  private notifyObservers() {
    this.observers.forEach((observer) => observer());
  }
}
