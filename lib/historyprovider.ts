const HISTORY_STORAGE = "chatgpt-history";

export function getHistory(): string[] | undefined {
  if (typeof window !== "undefined") {
    return localStorage.getItem(HISTORY_STORAGE)?.split("[end]\n");
  }
  return undefined;
}

export function setHistory(historyItem: string) {
    const oldHistory = getHistory() ?? [];
    const newHistory = [historyItem, ...oldHistory];
    let str = "";
    newHistory.map(h => {
        str += h + "[end]\n";
    })
  localStorage.setItem(HISTORY_STORAGE, str);
}
