import { IDataStorage } from "@/types/idatastorage";

export class LocalDataStorage<T> implements IDataStorage<T> {
  private observers: (() => void)[] = [];
  allData: Map<string, T> = new Map();
  localStorageKey: string;

  constructor(localStorageKey: string) {
    this.localStorageKey = localStorageKey; 
  }

  async ensureDataIsAvailable() {
    const data = localStorage.getItem(this.localStorageKey);
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
    localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    this.notifyObservers();
  }

  async remove(id: string) {
    this.ensureDataIsAvailable();
    this.allData.delete(id);

    const obj = Object.fromEntries(this.allData);
    localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    this.notifyObservers();
  }

  async clear() {
    this.allData.clear();

    const obj = Object.fromEntries(this.allData);
    localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
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
