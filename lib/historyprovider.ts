const HISTORY_STORAGE = "chatgpt-history";

export function getHistory(): string[] | undefined {
  return localStorage.getItem(HISTORY_STORAGE)?.split('\n');
}

export function setHistory(historyItem: string) {
    const oldHistory = getHistory() ?? [];
    const newHistory = [historyItem, ...oldHistory];
    let str = "";
    newHistory.map(h => {
        str += h + "\n";
    })
  localStorage.setItem(HISTORY_STORAGE, str);
}
