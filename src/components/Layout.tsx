import { ReactNode, useState } from "react";
import { PenTool, Wand2, MessageCircleQuestion, ImageIcon, History, Pin, X, ChevronRight } from "lucide-react";
import { useHistory } from "../HistoryContext";

interface LayoutProps {
  children: ReactNode;
  activeMode: string;
  setActiveMode: (mode: string) => void;
}

export const MODES = [
  { id: "review", label: "Revisar", icon: PenTool },
  { id: "generate", label: "Gerar", icon: Wand2 },
  { id: "explain", label: "Explicar", icon: MessageCircleQuestion },
  { id: "analyze", label: "Analisar", icon: ImageIcon },
];

export function Layout({ children, activeMode, setActiveMode }: LayoutProps) {
  const { history, togglePin, setActiveHistoryItem, activeHistoryItem } = useHistory();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-magalu-bg overflow-x-hidden">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="w-full px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-magalu-blue rounded-lg flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-gray-900">Lu Writer</h1>
              <p className="text-xs text-gray-600 font-medium">Copiloto de UX Writing · Magalu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className={`p-2 rounded-lg transition-colors ${historyOpen ? "bg-magalu-blue text-white" : "text-gray-600 hover:bg-gray-100"}`}
              title="Histórico da sessão"
            >
              <History className="w-5 h-5 focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2" />
            </button>
          </div>
        </div>
      </header>

      <div className="w-full flex-1 flex flex-col lg:flex-row py-6 gap-6 px-4 md:px-8 relative max-w-[1600px] mx-auto">
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
                    ${isActive 
                      ? "bg-magalu-blue/10 text-magalu-blue" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-magalu-blue" : "text-gray-600"}`} />
                  {mode.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[600px] w-full focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2">
            {children}
          </div>
        </main>
        
        {/* Right Sidebar: History Modal */}
        <>
          {/* Overlay */}
          {historyOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-40 transition-opacity" 
              onClick={() => setHistoryOpen(false)}
            />
          )}
          
          <div 
            className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${historyOpen ? "translate-x-0" : "translate-x-full"} shrink-0`}
          >
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <History className="w-5 h-5 text-magalu-blue" />
                <h2>Histórico da sessão</h2>
              </div>
              <button 
                onClick={() => setHistoryOpen(false)}
                className="p-2.5 text-gray-600 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-8 hide-scrollbar bg-gray-50/50">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-sm p-6 bg-white rounded-2xl border border-gray-100 border-dashed">
                  Nenhum histórico ainda nesta sessão.
                </div>
              ) : (
                [...history].sort((a, b) => {
                  if (a.pinned === b.pinned) return b.timestamp - a.timestamp;
                  return a.pinned ? -1 : 1;
                }).map((item) => (
                  <div 
                    key={item.id} 
                    className={`border rounded-2xl p-4 flex flex-col gap-2.5 transition-all cursor-pointer group shadow-sm ${activeHistoryItem?.id === item.id ? "border-magalu-blue bg-white ring-1 ring-magalu-blue shadow-md" : "border-gray-200 hover:border-magalu-blue/50 bg-white hover:shadow-md"}`}
                    onClick={() => setActiveHistoryItem(item)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{MODES.find(m => m.id === item.mode)?.label || item.mode}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(item.id);
                        }}
                        className={`shrink-0 p-1.5 -m-1.5 rounded-lg transition-colors ${item.pinned ? "text-amber-500 bg-amber-50" : "text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"}`}
                        title={item.pinned ? "Desafixar" : "Fixar"}
                      >
                        <Pin className="w-3.5 h-3.5 focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2" />
                      </button>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                      {item.title}
                    </div>
                    
                    {item.summary && (
                      <div className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        {item.summary}
                      </div>
                    )}
                    
                    {item.verdict && (
                      <div className="flex items-center gap-2 mt-1">
                        {item.verdict.toLowerCase().includes("conforme") && !item.verdict.toLowerCase().includes("não") ? (
                          <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">Conforme</span>
                        ) : item.verdict.toLowerCase().includes("não") ? (
                          <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">Não conforme</span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">Ajustar</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
