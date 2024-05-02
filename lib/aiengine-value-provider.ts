import { createContext } from 'react';
import { AIEngineModel } from './aiengine-storage';

export const AIEngineValueContext = createContext<AIEngineModel>(AIEngineModel.Gpt3_5);