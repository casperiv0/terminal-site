import create from "zustand";

interface HistoryStore {
  history: string[];
  setHistory(history: string[]): void;
}

const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  setHistory: (history) => set({ history }),
}));

export function useHistory() {
  const historyStore = useHistoryStore();

  function addCommandToHistory(command: string) {
    const newHistory = [...historyStore.history, command];
    historyStore.setHistory(newHistory);
  }

  function getPreviousCommand(recursiveIdx: number) {
    const idxOfCommand = historyStore.history.length - 1 - recursiveIdx;
    return historyStore.history[idxOfCommand] ?? null;
  }

  return { addCommandToHistory, getPreviousCommand, history: historyStore.history };
}
