import { IDataStorage } from '@/types/idatastorage';
import { createContext } from 'react';

export const DataStorageContext = createContext<IDataStorage>({} as IDataStorage);