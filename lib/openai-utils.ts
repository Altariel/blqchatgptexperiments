import { CustomRole, Message, OpenAIRole } from "@/types/chattypes";
import { OpenAI } from "openai";
import { AIChatEngineModel, AIImageEngineModel, AITranscribeEngineModel, getAIChatEngineModelString, getAIImageEngineModel, getAITranscribeEngineModel } from "./aiengine-storage";

export enum OpenAIApiErrorType {
    InvalidApiKey,
    NoAnswer,
    Exception,
}

export type OpenAIApiError = {
  type: OpenAIApiErrorType;
  message: string;
};

export function isOpenApiError(error: any): error is OpenAIApiError {
    return error.type !== undefined && error.message !== undefined;
}

export async function transcribe(apiKey: string, file: File, aiEngineModel: AITranscribeEngineModel): Promise<string|OpenAIApiError> {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    // const response = await openai.createChatCompletion({
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: getAITranscribeEngineModel(aiEngineModel),
      language: "it",
      response_format: "verbose_json",
    });

    return response.text;
  } catch (error) {
    return {
        type: OpenAIApiErrorType.Exception,    
        message: "" + error
    };
  }
}

export async function chat(apiKey: string, aiEngineModel: AIChatEngineModel,  messages: Message[]) : Promise<string|OpenAIApiError> {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const query = messages
    .filter((m) => m.role !== CustomRole.Application)
    .map((message) => {
      return { role: message.role as OpenAIRole, content: message.content };
    });

  const aiChatEngineModelString = getAIChatEngineModelString(aiEngineModel);

  try {
    const response = await openai.chat.completions.create({
      model: aiChatEngineModelString,
      messages: query
    });

    return (
      response.choices[0].message.content || "I'm sorry, I don't understand"
    );
  } catch (error: unknown) {
    return {
        type: OpenAIApiErrorType.Exception,    
        message: "" + error
    };
  }
}

export type ImageResponse = {
  b64_json: string;
  revised_prompt: string;
};

export async function generate(
  apiKey: string,
  input: string,
  aiEngineModel: AIImageEngineModel
): Promise<ImageResponse|OpenAIApiError> {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await openai.images.generate({
      model: getAIImageEngineModel(aiEngineModel),
      prompt: input,
      n: 1,
      size: "1024x1024",
      style: "natural",
      response_format: "b64_json",
    });

    const { b64_json, revised_prompt } = response.data[0];
    if (b64_json) {
      return {
        b64_json,
        revised_prompt: revised_prompt || "",
      };
    }

    return {
        type: OpenAIApiErrorType.NoAnswer,    
        message: "No image generated"
    };
  } catch (error: unknown) {
    return {
        type: OpenAIApiErrorType.Exception,    
        message: "" + error
    };
  }
}
