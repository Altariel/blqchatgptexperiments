const API_KEY_STORAGE = "chatgpt-api-key";

export function getAPIKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE);
}

export function setAPIKey(apiKey: string) {
  localStorage.setItem(API_KEY_STORAGE, apiKey);
}
