import { ChatSession } from "./chattypes";

export interface IDataStorage {
    get(id: string): Promise<ChatSession | undefined>;
    set(value: ChatSession): Promise<void>;
    remove(id: string): Promise<void>;
    clear(): Promise<void>;
    getAll(): Promise<ChatSession[]>
}