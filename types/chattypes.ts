export enum OpenAIRole {
    System = "system",
    User = "user",
    Assistant = "assistant",   
}

export enum CustomRole{    
    Application = "application",
}

export type Role = OpenAIRole | CustomRole;

export type Message = {
    id: number,
    content: string,
    role: Role,
    timestamp: number,
}

export type ChatSession = {
    id: string,
    messages: Message[],
}

export type TranscribeSession = {
    id: string,
    trascription: string;
    timestamp: number;
}

export type GenerateSession = {
    id: string,
    generatedImageId: string;
    timestamp: number;
}

export function getChatSessionId(messages: Message[]): string {
    const message = messages.find( (message) => message.role === OpenAIRole.User);
    return (messages && message?.content) ||  "unknown";
}
