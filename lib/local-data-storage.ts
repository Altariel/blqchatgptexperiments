import { ChatSession } from "@/types/chattypes";
import { IDataStorage } from "@/types/idatastorage";

const HISTORY_STORAGE = "chatgpt-history";

export class LocalDataStorage implements IDataStorage {
  allData: Map<string, ChatSession> = new Map();

  async ensureDataIsAvailable() {
    const data = localStorage.getItem(HISTORY_STORAGE);
    if (data) {
      const data2 = JSON.parse(data);
      if (data2) {
        this.allData = new Map(data2.map((obj: ChatSession) => [obj.id, obj]));
      } else {
        this.allData = new Map();
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
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(this.allData.values()));
  }

  async remove(id: string) {
    this.ensureDataIsAvailable();
    this.allData.delete(id);
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(this.allData.values()));
  }
  async clear() {
    this.allData.clear();
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(this.allData.values()));
  }
}
