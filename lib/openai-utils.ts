import { OpenAI } from "openai";

const model = "gpt-4-0125-preview";

export async function transcribe(apiKey: string, file: File): Promise<string> {

      const openai = new OpenAI({
        apiKey: apiKey, dangerouslyAllowBrowser: true
      });

      try {
        // const response = await openai.createChatCompletion({
        const response = await openai.audio.transcriptions.create({
          file: file,
          model: 'whisper-1',
          language: "it",
          response_format: "verbose_json",
        });

        return response.text;
      } catch (error) {
        return "Error: No answer." + error;
      }
}

export async function chat(apiKey: string, message: string) {

    const openai = new OpenAI({
      apiKey: apiKey, dangerouslyAllowBrowser: true
    });

    const query = message;

    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: query,
          }]
      });

      return response.choices[0].message.content || "I'm sorry, I don't understand";
    } catch (error:unknown) {
      return (error as any).toString();
    }
}