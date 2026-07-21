import { createContext, useContext, useState, ReactNode } from "react";

export interface HistoryItem {
  id: string;
  mode: string;
  title: string;
  summary: string;
  verdict?: string;
  timestamp: number;
  pinned: boolean;
  inputData: any;
  resultData: any;
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, "id" | "timestamp" | "pinned">) => void;
  togglePin: (id: string) => void;
  activeHistoryItem: HistoryItem | null;
  setActiveHistoryItem: (item: HistoryItem | null) => void;
}

export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);

  const addToHistory = (item: Omit<HistoryItem, "id" | "timestamp" | "pinned">) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      pinned: false,
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const togglePin = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, togglePin, activeHistoryItem, setActiveHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be used within HistoryProvider");
  return context;
}
