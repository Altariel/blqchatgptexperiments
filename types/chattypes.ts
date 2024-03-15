export enum Role {
    System = "system",
    User = "user",
    Assistant = "assistant",
}
export type Message = {
    id: number,
    message: string,
    role: Role,
    timestamp: number,
}

export type ChatSession = {
    id: number,
    messages: Message[],
}