export interface IDataStorage<T> {
    get(id: string): Promise<T | undefined>;
    set(value: T): Promise<void>;
    remove(id: string): Promise<void>;
    clear(): Promise<void>;
    getAll(): Promise<T[]>;
}
