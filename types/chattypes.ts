export enum Sender {
    Bot = "bot",
    User = "user",
}
export type SentMessage = {
    id: number,
    message: string
    sender: Sender

}