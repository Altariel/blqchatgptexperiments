import { IAIEngineStorage } from '@/types/iaienginestorage';
import { createContext } from 'react';

export const AIEngineStorageContext = createContext<IAIEngineStorage>({} as IAIEngineStorage);
