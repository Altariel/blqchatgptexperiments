import { GenerateSession } from "@/types/chattypes";
import { IDataStorage } from "@/types/idatastorage";
import Dexie, { EntityTable } from 'dexie';

type DexieDb = Dexie & { generateHistoryStore: EntityTable<GenerateSession> };

export class LocalIndexedDbDataStorage implements IDataStorage<GenerateSession> {

  private observers: (() => void)[] = [];

  private objectStoreName: string = "generateHistoryStore";
  private myDbName: string = "generate-history";

  private openDB(): DexieDb {
    const db = new Dexie(this.myDbName) as DexieDb;
    
    // Schema declaration:
    db.version(1).stores({
      [this.objectStoreName]: 'id'
    });

    return db;
  }

  public async get(id: string): Promise<GenerateSession | undefined> {
    const db = this.openDB();
    return db.generateHistoryStore.get({id});
  }

  public async set(message: GenerateSession): Promise<void> {
    const db = this.openDB();
    await db.generateHistoryStore.put(message);
    this.notifyObservers();
  }

  public async remove(id: string): Promise<void> {
    const db = this.openDB();
    await db.generateHistoryStore.where('id').equals(id).delete();
    this.notifyObservers();
  }

  public async clear(): Promise<void> {
    const db = this.openDB();
    await db.generateHistoryStore.clear();
    this.notifyObservers();
  }

  public async getAll(): Promise<GenerateSession[]> {
    const db = this.openDB();
    return await db.generateHistoryStore.toArray();
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
