import { IAPIKeyStorage } from '@/types/iapikeystorage';
import { createContext } from 'react';

export const ApiKeyStorageContext = createContext<IAPIKeyStorage>({} as IAPIKeyStorage);