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