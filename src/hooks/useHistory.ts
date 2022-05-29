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

  function getPreviousCommand(index: number) {
    const idxOfCommand = historyStore.history.length - index;
    return historyStore.history[idxOfCommand] ?? null;
  }

  function getNextCommand(index: number) {
    const idxOfCommand = index - historyStore.history.length;
    return historyStore.history[idxOfCommand] ?? null;
  }

  return { addCommandToHistory, getNextCommand, getPreviousCommand, history: historyStore.history };
}
