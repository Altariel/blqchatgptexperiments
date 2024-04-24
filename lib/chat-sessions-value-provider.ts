import { ChatSession } from '@/types/chattypes';
import { createContext } from 'react';

export const ChatSessionsValueContext = createContext<ChatSession[]>([]);