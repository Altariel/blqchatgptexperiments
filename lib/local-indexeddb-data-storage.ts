import { IDataStorage } from "@/types/idatastorage";

export class LocalIndexedDbDataStorage<T> implements IDataStorage<T> {
  private observers: (() => void)[] = [];
  allData: Map<string, T> = new Map();

  private objectStoreName: string = "messages";
  private myDbName: string = "myIndexedDB";

  constructor(dbName:string, objectStoreName:string) {
    this.myDbName = dbName;
    this.objectStoreName = objectStoreName;
    // this.init();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.myDbName, 1);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.objectStoreName, { keyPath: "id" });
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
    });
  }

  public async get(id: string): Promise<T | undefined> {
    const objectStoreName = this.objectStoreName;
    const db = await this.openDB();
    return new Promise(function (resolve, reject) {
      const transaction = db.transaction(objectStoreName, "readonly");
      const objectStore = transaction.objectStore(objectStoreName);
      const request = objectStore.get(id);
      request.onsuccess = () => {
        db.close();
        return resolve(request.result);
      };
    });
  }

  public async set(message: T): Promise<void> {
    const objectStoreName = this.objectStoreName;
    const db = await this.openDB();
    const notifyObservers = this.notifyObservers.bind(this);
    return new Promise(function (resolve, reject) {
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      objectStore.add(message);
      transaction.oncomplete = () => {
        db.close();
        notifyObservers();
        return resolve();
      };
    });
  }

  public async remove(id: string): Promise<void> {
    const objectStoreName = this.objectStoreName;
    const db = await this.openDB();
    const notifyObservers = this.notifyObservers.bind(this);
    return new Promise(function (resolve, reject) {
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      objectStore.delete(id);
      transaction.oncomplete = () => {
        db.close();
        notifyObservers();
        return resolve();
      };
    });
  }

  public async clear(): Promise<void> {
    const objectStoreName = this.objectStoreName;
    const db = await this.openDB();
    const notifyObservers = this.notifyObservers.bind(this);
    return new Promise(function (resolve, reject) {
      const transaction = db.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      objectStore.clear();
      transaction.oncomplete = () => {
        db.close();
        notifyObservers();
        return resolve();
      };
    });
  }

  public async getAll(): Promise<T[]> {
    const objectStoreName = this.objectStoreName;
    const db = await this.openDB();
    return new Promise(function (resolve, reject) {
      const transaction = db.transaction(objectStoreName, "readonly");
      const objectStore = transaction.objectStore(objectStoreName);
      const request2 = objectStore.getAll();
      request2.onsuccess = () => {
        db.close();
        return resolve(request2.result);
      };
    });
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
