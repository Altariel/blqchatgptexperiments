import { createContext } from 'react';
import { AIEnginesType, DefaultEngines } from './aiengine-storage';

export const AIEnginesValueContext = createContext<AIEnginesType>(DefaultEngines);