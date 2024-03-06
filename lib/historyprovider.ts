const HISTORY_STORAGE = "chatgpt-history";

export function getHistory(): string[] | undefined {
  if (typeof window !== "undefined") {
    const storageStr = localStorage.getItem(HISTORY_STORAGE);
    if (storageStr) {
      const historyArray = JSON.parse(storageStr) as string[];
      return historyArray;
    }
  }
  return undefined;
}

export function setHistory(historyItem: string) {
    const oldHistory = getHistory() ?? [];
    const newHistory = [historyItem, ...oldHistory];
    const str = JSON.stringify(newHistory);   
  localStorage.setItem(HISTORY_STORAGE, str);
}
